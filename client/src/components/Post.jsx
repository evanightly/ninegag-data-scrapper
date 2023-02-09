import { useContext, useEffect, useState } from "react";
import { Badge, Button, Card, Modal, Form } from "react-bootstrap";
import config from '../config'
import titleCase from "../helper/titleCase";
import axios from "axios";
import { TagContext } from "../pages/Posts";

const { SERVER_ORIGIN, DEFAULT_MEDIA_VOLUME } = config
export default function Post({ post }) {
    useEffect(() => {
        console.log("Post:", post)
    }, [post])
    const [state] = useState(post)
    const { id, title, author, dateCreated } = state

    return (
        <Card style={{ width: '18rem' }}>
            <Media />
            <Card.Body>
                <Card.Title>
                    <a
                        className="text-decoration-none"
                        href={`https://9gag.com/gag/${id}#comment`}
                        target="_blank"
                        rel="noreferrer">
                        {title}
                    </a>
                </Card.Title>
                <Tags />
            </Card.Body>
            <Footer />
        </Card>
    )

    function Media() {
        const mediaType = state.mediaType === "Animated" ? "video" : "image"
        const mediaSource = `${SERVER_ORIGIN}/media/${mediaType}/${id}`
        const replaceElement = mediaType === "video" ? "video" : "img"

        const handlePauseOnBlur = e => e.target.pause()
        const handleSetVolumeOnPlay = e => e.target.volume = DEFAULT_MEDIA_VOLUME
        return <Card.Img as={replaceElement} variant="top" src={mediaSource} controls onBlur={handlePauseOnBlur} onPlay={handleSetVolumeOnPlay} />
    }

    function Tags() {
        const { loadTags } = useContext(TagContext)

        const [tags, setTags] = useState(state.tags)
        function Tag({ tag }) {
            const handleDeleteTag = async (tag) => {
                if (tag.tagType === "Custom") {
                    const { _id: tag_id } = tag
                    const url = `${SERVER_ORIGIN}/tag/remove`
                    const body = { post_id: state._id, tag_id }
                    const { data: post } = await axios.post(url, body)
                    setTags(post.tags)
                    loadTags()
                }
            }

            return (
                <Badge
                    role="button"
                    className="me-1"
                    pill
                    bg={tag.tagType === "Custom" ? "warning" : "primary"}
                    onClick={() => handleDeleteTag(tag)}>
                    {titleCase(tag.title)}
                </Badge>
            )
        }

        return (
            <>
                {tags.map((tag, index) => (
                    <Tag tag={tag} key={index} />
                ))}
                <NewTag setTags={setTags} />
            </>
        )
    }

    function NewTag({ setTags }) {
        // This will allow you to add custom tag
        const { loadTags } = useContext(TagContext)
        const [show, setShow] = useState(false)
        const [newTag, setNewTag] = useState('')
        const handleShow = () => setShow(true)
        const handleClose = () => setShow(false)
        const handleChangeNewTag = e => setNewTag(e.target.value)
        const handleSubmit = async e => {
            e.preventDefault()
            const url = `${SERVER_ORIGIN}/tag`
            const body = { post_id: state._id, tagTitle: newTag }
            const { data: { post } } = await axios.post(url, body)
            setTags(post.tags)
            loadTags()
            handleClose()
        }
        return (
            <>
                <Badge
                    role="button"
                    pill
                    bg="success"
                    onClick={handleShow}>
                    <i className="bi bi-plus-lg"></i>
                </Badge>

                <Modal
                    show={show}
                    onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Custom Tag</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Your custom tag will be different from the usual tag</Form.Label>
                                <Form.Control onChange={handleChangeNewTag} required />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button type="submit" variant="success">
                                Create
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }

    function Footer() {
        function Author() {
            if (!author) return
            const authorProfile = `https://9gag.com/u/${author.username}`
            const style = { borderRadius: "50%", width: 35, height: 35, backgroundColor: "#0080FE", display: "flex" }
            return (
                <a href={authorProfile} target="_blank" rel="noreferrer">
                    <div className="d-flex justify-content-center align-items-center text-light" style={style}>{author.username[0].toUpperCase()}</div>
                    {/* <Image src={author.avatarUrl} style={style} /> */}
                </a>
            )
        }

        const date = new Date(dateCreated).toDateString()
        return (
            <Card.Footer
                className="text-muted d-flex justify-content-between align-items-center">
                <Author />
                <p className="mb-0">{date}</p>
            </Card.Footer>
        )
    }
}