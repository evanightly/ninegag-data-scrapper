import { Button, ButtonGroup, Container, Form, InputGroup, Modal, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { ThemeContext } from "../App";
import { useContext, useEffect, useCallback, useState } from "react";
import $ from 'jquery'
import axios from "axios";
import config from '../config'
export default function PostsNavigation() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    const [showModal, setShowModal] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const { data: posts } = await axios
            .get(config.SERVER_ORIGIN + '/post/search', { params: { searchQuery: state.postSearch } })

        posts.length > 100
            ? (
                <>
                    {console.log(posts)}
                    {alert("Search result more than 100 posts, please try to be more specific, or check the console for the results")}
                </>
            )
            : dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, postSearch: '', searchMode: true } })
    }, [ACTIONS, dispatch, state.postSearch])

    const handleChangeSearch = useCallback(e => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postSearch: e.target.value } })
    }, [ACTIONS, dispatch])

    const handleChangePostType = (postType) => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postType } })
    }

    const handleChangePostLimit = async (e) => {
        const postLimit = parseInt(e.target.value)
        let { data: postTotal } = await axios
            .get(config.SERVER_ORIGIN + '/post/total/' + state.postType)

        postTotal = Math.ceil(postTotal / postLimit)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postLimit, postTotal } })
    }

    const handleChangeDarkMode = () => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { darkMode: !state.darkMode } })
    }

    const handleReset = () => {
        if (state.searchMode) {
            const { SERVER_ORIGIN } = config
            axios
                .get(`${SERVER_ORIGIN}/post/${state.postType}/${(state.page - 1) * state.postLimit}/${state.postLimit}`)
                .then(({ data: posts }) => {
                    dispatch({ type: ACTIONS.SET_REDUCER, payload: { searchMode: false, posts } })
                })
        }
    }

    const handleSelectedTag = async (_id) => {
        const { data: posts } = await axios.get(config.SERVER_ORIGIN + '/tag/' + _id)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, searchMode: true } })
        setShowModal(false)
    }

    useEffect(() => {
        state.darkMode
            ? $('body').addClass('darkMode')
            : $('body').removeClass('darkMode')
    }, [state.darkMode])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [state.page])

    useEffect(() => {
        axios
            .get(config.SERVER_ORIGIN + '/tag')
            .then(({ data: postTags }) => dispatch({ type: ACTIONS.SET_REDUCER, payload: { postTags } }))
    }, [ACTIONS.SET_REDUCER, dispatch])

    return (
        <Navbar
            bg={state.darkMode ? "danger" : "primary"}
            expand="lg"
            className="p-0 px-2 py-3 rounded">

            <Container
                fluid
                className="justify-content-between">

                <Navbar.Brand onClick={handleReset} role="button">NineSystem</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="w-0" id="basic-navbar-nav">
                    <Form onSubmit={handleSubmit} className="w-100">
                        <InputGroup className="w-25 mx-auto">
                            <Form.Control
                                placeholder="Search"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                style={{ borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", border: "none" }}
                                value={state.postSearch}
                                required
                                onChange={handleChangeSearch}
                            />

                            <InputGroup.Text
                                as="button"
                                type="submit"
                                className="bg-white"
                                style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px", border: "none" }}>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>

                        </InputGroup>
                    </Form>

                    <Nav className="ms-auto">
                        <Nav.Link role="button" onClick={() => setShowModal(true)}><i className="bi bi-tags"></i></Nav.Link>

                        <Modal className="tag-modal" fullscreen show={showModal} onHide={() => setShowModal(false)}>
                            {state.darkMode ?
                                <Modal.Header closeButton closeVariant="white">
                                    <Modal.Title>Tags</Modal.Title>
                                </Modal.Header>
                                :
                                <Modal.Header closeButton>
                                    <Modal.Title>Tags</Modal.Title>
                                </Modal.Header>
                            }

                            <Modal.Body className=" d-flex flex-wrap gap-2">
                                {state.postTags.map((tag, index) => (
                                    <ButtonGroup key={index}>
                                        <Button
                                            variant={tag.tagType === "Custom" ? "warning" : "primary"}
                                            onClick={() => handleSelectedTag(tag._id)}>
                                            {tag.title}
                                        </Button>

                                        <Button
                                            variant={tag.tagType === "Custom" ? "warning" : "primary"}
                                            disabled>
                                            {tag.postSize}
                                        </Button>

                                    </ButtonGroup>
                                ))}
                            </Modal.Body>
                        </Modal>

                        <NavDropdown
                            title={<i className="bi bi-infinity"></i>}
                            id="basic-nav-dropdown"
                            focusFirstItemOnShow>

                            <NavDropdown.Item
                                className="p-0 px-1 d-flex flex-column"
                                as="span">

                                <Form.Label
                                    htmlFor="changePostLimit"
                                    children={<p className="text-center m-0">Post Limits</p>} />

                                <Container
                                    fluid
                                    className="d-flex p-0 align-items-center">
                                    <p className="m-0">10</p>
                                    <Form.Range
                                        id="changePostLimit"
                                        step={10}
                                        max={100}
                                        min={10}
                                        value={state.postLimit}
                                        className="mx-2"
                                        onChange={handleChangePostLimit} />
                                    <p className="m-0">100</p>
                                </Container>

                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                            title={<i className="bi bi-gear"></i>}
                            id="basic-nav-dropdown">

                            <NavDropdown.Item onClick={handleChangeDarkMode}>
                                {state.darkMode
                                    ? <div className="text-warning">
                                        <i className="bi bi-brightness-high"></i> Light Mode
                                    </ div>
                                    : <><i className="bi bi-moon"></i> Dark Mode</>}
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => handleChangePostType(1)}
                                className="text-danger">
                                <i className="bi bi-bookmark"></i> Saved

                            </NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => handleChangePostType(2)}
                                className="text-primary">
                                <i className="bi bi-arrow-up"></i> Voted
                            </NavDropdown.Item>

                            <NavDropdown.Divider />

                            <NavDropdown.Item>
                                <i className="bi bi-arrow-repeat"></i> Sync Posts
                            </NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}