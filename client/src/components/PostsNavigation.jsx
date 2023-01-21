import { Container, Form, InputGroup, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { ThemeContext } from "../App";
import { useContext, useEffect } from "react";
import $ from 'jquery'
import axios from "axios";
import config from '../config'
import { useCallback } from "react";
export default function PostsNavigation() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    const handleChangePostType = (postType) => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postType } })
    }

    const handleChangePostLimit = async (e) => {
        const postLimit = parseInt(e.target.value)
        let { data: postTotal } = await axios.get(config.SERVER_ORIGIN + '/post/total/' + state.postType)
        postTotal = Math.ceil(postTotal / postLimit)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postLimit, postTotal } })
    }

    const handleChangeDarkMode = () => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { darkMode: !state.darkMode } })
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        const { data: posts } = await axios.get(config.SERVER_ORIGIN + '/post/search', { params: { searchQuery: state.postSearch } })
        if (posts.length > 100) {
            alert("Search result more than 100 posts, please try to be more specific")
        } else {
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, postSearch: '' } })
        }

    }, [ACTIONS, dispatch, state.postSearch])

    const handleChangeSearch = useCallback(e => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { postSearch: e.target.value } })
    }, [ACTIONS, dispatch])

    useEffect(() => {
        if (state.darkMode) {
            $('body').addClass('darkMode')
        } else {
            $('body').removeClass('darkMode')
        }
    }, [state.darkMode])

    return (
        <Navbar
            bg={state.darkMode ? "danger" : "primary"}
            expand="lg"
            className="p-0 px-2 py-3 rounded">

            <Container
                fluid
                className="justify-content-between">

                <Navbar.Brand>NineSystem</Navbar.Brand>
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
                        <NavDropdown title="Post Limits" id="basic-nav-dropdown" focusFirstItemOnShow>
                            <NavDropdown.Item className="p-0 px-1" as="span">
                                <Form.Range
                                    step={10}
                                    max={100}
                                    min={10}
                                    value={state.postLimit}
                                    onChange={handleChangePostLimit} />

                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Settings" id="basic-nav-dropdown">
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