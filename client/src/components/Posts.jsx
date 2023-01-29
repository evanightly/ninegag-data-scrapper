import axios from 'axios';
import {
    memo,
    useContext,
    useMemo,
    useState
} from "react";
import { Badge, Button, Card, Form, Modal } from 'react-bootstrap';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ThemeContext } from "../App";
import config from '../config';

const Post = ({ postProps }) => {
    const [post, setPost] = useState(postProps)
    const [show, setShow] = useState(false)
    

    const Media = memo(() => {
        const { mediaType, mediaSources } = post
        return (
            <Card.Img
                height="100%"
                variant="top"
                onBlur={(e) => e.target.pause()}
                onPlay={(e) => e.target.volume = config.DEFAULT_MEDIA_VOLUME}
                onError={(e) => console.log("Error when loading on post " + post.id)}
                controls={mediaType === "Animated" ? true : false}
                as={mediaType === "Animated" ? "video" : "img"}
                src={mediaType === "Animated" ? mediaSources.image460sv.url : mediaSources.image700.url} />
        )
    }, [post])

    const hideModal = () => setShow(false)

    const showModal = () => setShow(true)

    const PostModal = memo(props => {
        const [tag, setTag] = useState('')

        const handleInputTag = (e) => setTag(e.target.value)

        const handleSubmit = async (e) => {
            e.preventDefault()
            const { post: postData, setPost } = props
            const url = config.SERVER_ORIGIN + '/tag'
            const body = { post_id: postData._id, tagTitle: tag }
            const { data: { post } } = await axios.post(url, body)
            setPost(post)
            hideModal()
        }

        return (
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Custom Tag</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control onChange={handleInputTag} value={tag} required />
                            <Form.Text className="text-muted">
                                Your custom tag will be different from the usual tag
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={hideModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }, [show])

    const PostTags = memo(() => {
        const postData = post
        
        const handleDeleteTag = async (tag) => {
            if (tag.tagType === "Custom") {
                const { _id: tag_id } = tag
                const url = config.SERVER_ORIGIN + "/tag/remove"
                const body = { post_id: postData._id, tag_id }
                const { data: post } = await axios.post(url, body)
                setPost(post)
            }
        }

        return (
            post.tags.map((tag, index) => {
                const bg = tag.tagType === "Custom" ? "warning" : "primary"
                return (
                    <Badge
                        key={index}
                        pill
                        bg={bg}
                        role="button"
                        className="me-1 text-capitalize mt-2"
                        onClick={() => handleDeleteTag(tag)}>
                        {tag.title}
                    </Badge>
                )
            }))
    }, [post])

    const AddNewTag = () => (
        <Badge
            pill
            bg="success"
            children={<i className="bi bi-plus"></i>}
            as="button"
            className="border-0"
            onClick={showModal} />
    )

    const PostTitle = () => {
        const postSource = "https://9gag.com/gag/" + post.id

        return (
            <Card.Title
                as="a"
                href={postSource}
                target="_blank"
                className="h5 text-decoration-none text-light">
                {post.title}
            </Card.Title>
        )
    }

    const PostDate = () => {
        const date = new Date(post.dateCreated).toDateString()
        return <small className="text-muted">{date}</small>
    }

    const PostBody = memo(() => {
        return JSON.stringify(post) !== "{}" && (
            <Card style={{ width: 300 }}>
                <Media />
                <PostModal
                    post={post}
                    setPost={setPost} />
                <Card.Body>
                    <PostTitle />
                    <Card.Text>
                        <PostTags post={post} />
                        <AddNewTag />
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <PostDate />
                </Card.Footer>
            </Card>
        )
    }, [post])

    return <PostBody />
}

export default function Posts() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    useMemo(() => {
        console.log("Get Data")
        const { SERVER_ORIGIN } = config
        axios
            .get(`${SERVER_ORIGIN}/post/${state.postType}/${(state.page - 1) * state.postLimit}/${state.postLimit}`)
            .then(({ data: posts }) => {
                axios.get(SERVER_ORIGIN + '/post/total/' + state.postType).then(({ data: postTotal }) => {
                    postTotal = Math.ceil(postTotal / state.postLimit)
                    dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, postTotal } })
                })
            })
    }, [state.postType, state.page, state.postLimit, dispatch, ACTIONS.SET_REDUCER])

    const Posts = memo(() => {
        const breakpoints = {
            360: 1,
            775: 2,
            1155: 3,
            1550: 4,
            1800: 5
        }

        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={breakpoints}>
                <Masonry gutter="70px">
                    {state.posts.map((post, index) => <Post key={index} postProps={post} />)}
                </Masonry>
            </ResponsiveMasonry>
        )
    }, [state.posts])
    return <Posts />
}