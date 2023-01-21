import { useEffect, useContext, useMemo } from "react";
import { ThemeContext } from "../App"
import { Badge, Card } from 'react-bootstrap'
import axios from 'axios'
import config from '../config'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const Post = ({ post }) => {
    const { state } = useContext(ThemeContext)

    const Media = useMemo(() => {
        const { mediaType, mediaSources } = post
        return (
            <Card.Img
                height="100%"
                variant="top"
                onBlur={(e) => e.target.pause()}
                onPlay={(e) => e.target.volume = config.DEFAULT_MEDIA_VOLUME}
                controls={mediaType === "Animated" ? true : false}
                as={mediaType === "Animated" ? "video" : "img"}
                src={mediaType === "Animated" ? mediaSources.image460sv.url : mediaSources.image700.url} />
        )
    }, [post])

    const PostBody = useMemo(() => {
        return (
            <Card
                style={{ width: 300 }}>
                {Media}
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                        {post.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                pill
                                bg="primary"
                                className="me-1 text-capitalize">
                                {tag.title}
                            </Badge>
                        ))}
                        <Badge
                            pill
                            bg="success"
                            children={<i className="bi bi-plus"></i>}
                            as="button"
                            className="border-0" />
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">{new Date(post.dateCreated).toDateString()}</small>
                </Card.Footer>
            </Card>
        )
    }, [state.posts])

    return post.title && PostBody
}

export default function Posts() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    useMemo(() => {
        console.log("Get Data")
        const { SERVER_ORIGIN } = config
        axios
            .get(`${SERVER_ORIGIN}/post/${state.postType}/${(state.page - 1) * state.postLimit}/${state.postLimit}`)
            .then(({ data: posts }) => {
                axios.get(SERVER_ORIGIN + '/post/total/' + state.postType).then(({data: postTotal}) => {
                    postTotal = Math.ceil(postTotal / state.postLimit)
                    dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, postTotal } })
                })
            })
    }, [state.postType, state.page, state.postLimit, dispatch, ACTIONS.SET_REDUCER])

    return (
        <ResponsiveMasonry columnsCountBreakPoints={{ 360: 1, 775: 2, 1155: 3, 1550: 4, 1800: 5 }}>
            <Masonry gutter="70px">
                {state.posts.map((post, index) => (
                    <Post key={index} post={post} />
                ))}
            </Masonry>
        </ResponsiveMasonry>
    )
}