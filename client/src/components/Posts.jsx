import React, { useState, useContext, useMemo, useEffect } from "react"
import Masonry from 'react-masonry-css'
import { ThemeContext } from "../App";
import axios from "axios";
import { SERVER_ORIGIN, DEFAULT_MEDIA_VOLUME } from '../config'
import $ from 'jquery'
import handleTagTitleCase from "../helper/titleCase";
const Post = ({ post, postIndex }) => {
    const { dispatch, ACTIONS } = useContext(ThemeContext)

    const [postState, setPostState] = useState({})
    const [readyState, setReadyState] = useState(false)

    useEffect(() => {
        setPostState(post)
        setReadyState(true)
    }, [post])

    const PostAuthor = () => {
        const { author } = postState
        if (typeof author === 'object')
            return (
                <a
                    className=""
                    href={`https://9gag.com/u/${author.username}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <img
                        className="author"
                        src={author.avatarUrl}
                        alt={author.username}
                    />
                </a>
            )
    }

    const PostDate = () => {
        let { dateCreated } = postState
        if (dateCreated !== undefined) {
            dateCreated = new Date(dateCreated)
            if (typeof dateCreated === 'object' && dateCreated !== null && 'toLocaleDateString' in dateCreated) {
                // Print the locale representation of Date string
                dateCreated = dateCreated.toLocaleDateString('default', { day: "2-digit", month: 'short', year: 'numeric' })
                return <p className="m-0 lh-lg" >{dateCreated}</p>
            }
        }
    }

    const PostMedia = () => {
        const { mediaType, mediaSources, id } = postState

        const handleVolume = ({ target }) => {
            target.muted = false
            target.volume = DEFAULT_MEDIA_VOLUME
        }

        const handlePauseVideo = ({ target }) => target.pause()

        const Video = () => (
            <video
                src={mediaSources.image460sv.url}
                muted
                loop
                controls
                preload="auto"
                className="rounded-top w-100"
                onPlay={handleVolume}
                onBlur={handlePauseVideo}
            />
        )

        const Image = () => (
            <img src={mediaSources.image700.url} alt={`post${id}`} className="rounded-top w-100" />
        )

        return mediaType === "Animated" ? <Video /> : <Image />
    }
    const PostTags = () => {
        // const { state, dispatch, ACTIONS } = useContext(ThemeContext)
        // const handleTagRemoval = async (postIndex, postId, tag) => {
        //     let conditions = { postId, tagId: tag._id }
        //     if (tag.tagType) { conditions.tagType = tag.tagType }

        //     const chunkIndex = state.page - 1
        //     const { data: updatedPost } = await axios.post(SERVER_ORIGIN + '/tag/remove', conditions)
        //     if (state.type === 'saved') {
        //         const arr = state.saved
        //         arr[chunkIndex][postIndex] = { ...updatedPost }
        //         dispatch({ type: ACTIONS.set_reducer, payload: { saved: arr } })
        //     } else if (state.type === 'voted') {
        //         const arr = state.voted
        //         arr[chunkIndex][postIndex] = { ...updatedPost }
        //         dispatch({ type: ACTIONS.set_reducer, payload: { voted: arr } })
        //     }
        //     const { data: tags } = await axios.get(`${SERVER_ORIGIN}/tag`)
        //     dispatch({ type: ACTIONS.set_reducer, payload: { tags } })
        // }

        const handleTagRemoval = async (tag) => {

            let conditions = { postId: postState._id, tagId: tag._id }
            const { data: updatedPost } = await axios.post(SERVER_ORIGIN + '/tag/remove', conditions)
            setPostState(updatedPost)

            const { data: tags } = await axios.get(`${SERVER_ORIGIN}/tag`)
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { tags } })
        }

        return postState.tags.map((tag, tagIndex) => {
            const tagColor = tag.tagType ? 'warning' : 'primary'
            const tagRemovalHandler = () => tag.tagType && handleTagRemoval(tag)
            return (
                <span
                    key={tagIndex}
                    role="button"
                    className={`badge rounded-pill text-bg-${tagColor}`}
                    onClick={tagRemovalHandler}
                >
                    {handleTagTitleCase(tag.title)}
                </span>
            )
        })
    }


    const PostBody = () => {
        const { id, _id, title } = postState

        return (
            <div className="card-body">
                <a className="text-decoration-none" href={`https://9gag.com/gag/${id}`} target="_blank" rel="noopener noreferrer"><h5 className="card-title text-truncate">{title}</h5></a>
                <div className="w-100">
                    <div className="col d-flex flex-column justify-content-between my-2">
                        <div className="d-flex justify-content-start align-items-center flex-wrap gap-1">
                            <PostTags postIndex={postIndex} />
                            <button type="button" className="btn btn-transparent p-0" data-bs-toggle="modal" data-bs-target={`#newTag${_id}`}>
                                <span className="badge rounded-pill text-bg-success"><i className="bi bi-plus"></i></span>
                            </button>
                        </div>
                        <div className="d-flex mt-2 justify-content-between align-items-center">
                            <PostAuthor />
                            <PostTagForm postIndex={postIndex} _id={_id} />
                            <PostDate />
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    const PostTagForm = ({ postIndex, _id }) => {
        const [newTagTitle, setNewTagTitle] = useState('')
        const onSubmit = async (e) => {
            e.preventDefault()

            // Resync specific post object
            const { data: { post } } = await axios.post(SERVER_ORIGIN + '/tag', { postId: _id, title: newTagTitle })
            setPostState(post)

            // Close Modal
            $(`#newTag${_id} button[data-bs-dismiss="modal"]`).trigger('click')

            // Resync all tags
            const { data: tags } = await axios.get(`${SERVER_ORIGIN}/tag`)
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { tags } })
        }

        return (
            <div autoFocus={false} className="modal fade" id={`newTag${_id}`} tabIndex="-1" aria-labelledby="newTagLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="newTagLabel">Add Your Custom Tag</h1>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor={`newTag${_id}`}>Please enter your new tag</label>
                                    <input autoFocus={true} value={newTagTitle} onChange={(e) => setNewTagTitle(e.target.value)} type="text" className="form-control mt-1" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    const memoPost = useMemo(() => (
        <div className="card m-2 position-relative">
            <PostMedia />
            <PostBody />
        </div>
    ), [postState])

    return readyState && memoPost
}

const Posts = () => {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    useMemo(async () => {
        const { data: tags } = await axios.get(`${SERVER_ORIGIN}/tag`)
        const { data: postTotal } = await axios.get(`${SERVER_ORIGIN}/post/total/${state.postType}`)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { tags, postTotal } })
    }, [])

    useMemo(async () => {
        let { postType, page, chunk: limit } = state
        const skip = (page - 1) * limit
        const { data: posts } = await axios.get(`${SERVER_ORIGIN}/post/${postType}/${skip}/${limit}`)

        dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts } })
    }, [state.postType, state.chunk, state.page])

    return useMemo(() => (
        <Masonry breakpointCols={5} className="cardmsr d-flex justify-content-start p-1">
            {state.posts && state.posts.length > 0 && state.posts.map((post, index) =>
                <Post
                    key={index}
                    postIndex={index}
                    post={post}
                />)}
        </Masonry>
    ), [state.posts])
}

export default Posts