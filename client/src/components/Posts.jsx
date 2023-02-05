import axios from 'axios';
import {
    memo,
    useContext,
    useMemo,
    useRef,
    useState,
    useTransition
} from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Stack } from 'react-bootstrap';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ThemeContext } from "../App";
import config from '../config';

const Post = ({ postProps }) => {
    const [post, setPost] = useState(postProps)
    const [show, setShow] = useState(false)

    const PostMedia = memo(() => {
        const { mediaType, id } = post
        const handlePauseOnBlur = e => e.target.pause()
        const handleDefaultVolume = e => e.target.volume = config.DEFAULT_MEDIA_VOLUME
        const handleControls = () => mediaType === "Animated" ? true : false
        const handleSubstituteElement = () => mediaType === "Animated" ? "video" : "img"
        const handleMediaSource = () => {
            let source =
                mediaType === "Animated"
                    ? `/media/video/${id}`
                    : `/media/image/${id}`
            return config.SERVER_ORIGIN + source
        }

        return (
            <Card.Img
                height="100%"
                variant="top"
                onBlur={handlePauseOnBlur}
                onPlay={handleDefaultVolume}
                onError={(e) => console.log("Error when loading on post " + post.id)}
                controls={handleControls()}
                as={handleSubstituteElement()}
                src={handleMediaSource()} />
        )
    }, [post])

    const PostAuthor = memo(() => {
        const style = {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
        }
        return post.author
            ? <a href={`https://9gag.com/u/${post.author.username}`} target='_blank' rel='noreferrer'>
                <img style={style} src={post.author.avatarUrl} alt={post.id} />
            </a>
            : <></>
    }, [postProps])

    const hideModal = () => setShow(false)
    const showModal = () => setShow(true)

    const PostModal = memo(props => {
        const { state } = useContext(ThemeContext)

        const inputRef = useRef()
        const submitRef = useRef()

        const handleSubmit = async (e) => {
            e.preventDefault()
            const tag = inputRef.current.value
            const { post: postData, setPost } = props
            const url = `${config.SERVER_ORIGIN}/tag`
            const body = { post_id: postData._id, tagTitle: tag }
            const { data: { post } } = await axios.post(url, body)
            setPost(post)
            hideModal()
        }

        const PostModalBody = memo(() => {
            const handleFastTag = (e) => {
                inputRef.current.value = e.target.innerText
                submitRef.current.click()
            }
            return (
                <Modal size='lg' show={show} onHide={hideModal}>
                    <Container>
                        <Row >
                            <Col>
                                <Modal.Header>
                                    <Modal.Title>Add Custom Tag</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Control ref={inputRef} required />
                                            <Form.Text className="text-muted">
                                                Your custom tag will be different from the usual tag
                                            </Form.Text>
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={hideModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit" ref={submitRef}>
                                            Create
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Col>
                            <div className="vr"></div>
                            <Col>
                                <Modal.Header closeButton>
                                    <Modal.Title>Available Tags</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        <Stack direction='horizontal' className='gap-2'>
                                            {state.postTags.map((tag, index) => tag.tagType === "Custom" &&
                                                <Button key={index} onClick={handleFastTag} variant='outline-warning' children={tag.title} />
                                            )}
                                        </Stack>
                                    </Modal.Body>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </Modal>
            )
        }, [show])

        return <PostModalBody />
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
        const PostCard = ({ children }) => <Card style={{ width: 300 }} children={children} />
        const PostBody = ({ children }) => (
            <Card.Body>
                <PostTitle />
                <Card.Text>
                    <PostTags post={post} />
                    <AddNewTag />
                </Card.Text>
            </Card.Body>
        )
        const PostFooter = ({ children }) => (
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <PostAuthor />
                <PostDate />
            </Card.Footer>
        )

        return (
            <PostCard>
                <PostMedia />
                <PostBody />
                <PostFooter />
            </PostCard>
        )
    }, [post])

    return (
        <>
            <PostModal post={post}
                setPost={setPost} />
            <PostBody />
        </>)
}

export default function Posts() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    const [isPending, startTransition] = useTransition()
    useMemo(() => {
        console.log("Get Data")
        const { SERVER_ORIGIN } = config

        const url = `${SERVER_ORIGIN}/post/${state.postType}/${(state.page - 1) * state.postLimit}/${state.postLimit}`
        startTransition(() =>
            axios
                .get(url)
                .then(({ data: posts }) => {
                    const url = `${SERVER_ORIGIN}/post/total/${state.postType}`

                    axios.get(url).then(({ data: postTotal }) => {
                        postTotal = Math.ceil(postTotal / state.postLimit)
                        dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, postTotal } })
                    })
                })
        )
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
            isPending
                ? "Loading"
                : <ResponsiveMasonry
                    columnsCountBreakPoints={breakpoints}>
                    <Masonry gutter="70px">
                        {state.posts.map((post, index) => <Post key={index} postProps={post} />)}
                    </Masonry>
                </ResponsiveMasonry>
        )
    }, [state.posts])
    return <Posts />
}