import { forwardRef, useContext, useRef, useState } from "react";
import { Badge, Button, Card, Modal, Form, Container, Row, Col, Image, Dropdown } from "react-bootstrap";
import config from '../config'
import titleCase from "../helper/titleCase";
import axios from "axios";
import { StateContext, TagContext } from "../pages/Posts";

const { SERVER_ORIGIN, DEFAULT_MEDIA_VOLUME } = config
export default function Post({ post }) {
    const [state] = useState(post)
    const { _id, id, title, author, dateCreated, archived } = state

    return (
        <Card style={{ width: '18rem' }} id="post-card">
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
                <Options />
            </Card.Body>
            <Footer />
        </Card>
    )

    function Options() {
        const { state, setState } = useContext(StateContext)
        const darkMode = state.darkMode ? "dark" : "white"

        const CustomToggle = forwardRef(({ children, onClick }, ref) => (
            <a
                href="/"
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                {children}
            </a>
        ));

        const CustomMenu = forwardRef(
            ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
                return (
                    <div
                        ref={ref}
                        style={style}
                        className={className}
                        aria-labelledby={labeledBy}
                    >
                        <ul className="list-unstyled m-0">
                            {children}
                        </ul>
                    </div>
                );
            }
        );

        const handleArchive = async () => {
            let setArchived = archived ? false : true
            await axios.post(SERVER_ORIGIN + '/post/archive/', { _id, archived: setArchived })
            let { posts } = state
            setState({ posts: posts.filter(post => post.id !== id) })
        }


        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} variant={darkMode} id="dropdown-basic">
                    <Badge
                        role="button"
                        className="me-1"
                        pill>
                        <i className="bi bi-three-dots"></i>
                    </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu} variant={darkMode}>
                    <Dropdown.Item onClick={handleArchive}>
                        {archived ? "Remove archive" : "Archive"}
                    </Dropdown.Item>
                    <Dropdown.Item disabled>
                        Delete (Coming Soon)
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

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
        const { loadTags, customTags } = useContext(TagContext)
        const [show, setShow] = useState(false)
        const [newTag, setNewTag] = useState('')
        const submitRef = useRef(null)
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

        const handleFastAdd = e => {
            setNewTag(e.target.innerText)
            submitRef.current.click()
            setNewTag("")
            setShow(false)
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
                    onHide={handleClose}
                    size="lg">
                    <Container fluid>
                        <Row>
                            <Col>
                                <Modal.Header>
                                    <Modal.Title>Add Custom Tag</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your custom tag will be different from the usual tag</Form.Label>
                                            <Form.Control value={newTag} onChange={handleChangeNewTag} required />
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button type="submit" variant="success" ref={submitRef}>
                                            Create
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Col>
                            <Col>
                                <Modal.Header>
                                    <Modal.Title>Available Tags</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3 flex-row">
                                        <Form.Label>Use this shortcut to ease input process</Form.Label>
                                        <Container fluid className="d-flex flex-wrap gap-2 p-0">
                                            {customTags.map(tag => <Button key={tag._id} variant="outline-warning" onClick={handleFastAdd}>{titleCase(tag.title)}</Button>)}
                                        </Container>
                                    </Form.Group>
                                </Modal.Body>
                            </Col>
                        </Row>
                    </Container>
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
                    {/* <div className="d-flex justify-content-center align-items-center text-light" style={style}>{author.username[0].toUpperCase()}</div> */}
                    <Image src={author.avatarUrl} style={style} />
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