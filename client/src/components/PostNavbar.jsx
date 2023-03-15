import { useContext, useMemo, useState } from 'react';
import { Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { StateContext, TagContext } from '../pages/Posts';
import axios from 'axios';
import config from '../config'
import PostNote from './PostNote'

export default function PostNavbar() {
    const [showModal, setShowModal] = useState(false)
    const MainPostNavbar = () => (
        <Navbar bg="primary" expand="lg" className='rounded'>
            <Container fluid className='py-1'>
                <Brand />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <SearchForm />
                    </Nav>
                    <Nav>
                        <PostNote />
                        <TagsModal />
                        <PostLimitSlider />
                        <PostSettings />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

    return <MainPostNavbar />;

    function handleShowModal() {
        setShowModal(true)
    }

    function handleHideModal() {
        setShowModal(false)
    }

    function TagsModal() {
        const { state, setState } = useContext(StateContext)
        const { tag } = useContext(TagContext)
        const { SERVER_ORIGIN } = config
        const handleSelectedTag = async (tag) => {
            const { _id, title } = tag
            const url = `${SERVER_ORIGIN}/tag/${_id}`
            const { data: posts } = await axios.get(url)
            setState({ posts, postSearch: `Tag: ${title}` })
            handleHideModal()
        }

        const ModalHeader = () => {
            const children = <Modal.Title>Tags</Modal.Title>
            let parent
            state.darkMode
                ? parent = <Modal.Header closeButton closeVariant='white' children={children} />
                : parent = <Modal.Header closeButton children={children} />
            return parent
        }

        const MemoTagsModal = useMemo(() => (
            <>
                <Nav.Link children={<i className="bi bi-tags-fill"></i>} onClick={handleShowModal} />
                <Modal id="tag-modal" show={showModal} onHide={handleHideModal} fullscreen>
                    <ModalHeader />
                    <Modal.Body>
                        {tag.map((tag, index) => {
                            const variant = tag.tagType === "Custom" ? "outline-warning" : "outline-primary"
                            return (
                                <Button className='m-1' key={index} variant={variant} onClick={() => handleSelectedTag(tag)}>
                                    {tag.title} | {tag.postSize}
                                </Button>
                            )
                        })}
                    </Modal.Body>
                </Modal>
            </>

            // eslint-disable-next-line
        ), [tag])

        return MemoTagsModal
    }
}

function Brand() {
    const { initialize } = useContext(StateContext)
    return <Navbar.Brand role="button" onClick={initialize}>NineSystem</Navbar.Brand>
}

function SearchForm() {
    const { setState } = useContext(StateContext)

    const [search, setSearch] = useState('')
    const style = { borderRadius: "20px", width: "25rem" }

    const handleChangeSearch = e => setSearch(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data: posts } = await axios
            .get(config.SERVER_ORIGIN + '/post/search', { params: { searchQuery: search } })
        setState({ posts, postSearch: `'${search}'` })
        setSearch("")
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup className='rounded-pill bg-light'>
                    <Form.Control
                        className='bg-transparent border-0'
                        style={style}
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={handleChangeSearch}
                        required
                    />
                    <InputGroup.Text className='p-0 bg-transparent border-0'>
                        <Button className='bg-transparent border-0' type='submit'>
                            <i className="bi bi-search text-dark"></i>
                        </Button>
                    </InputGroup.Text>
                </InputGroup>
            </Form.Group>
        </Form>
    )
}

function PostLimitSlider() {
    const { state, setState } = useContext(StateContext)
    const handlePostLimit = e => {
        const { value } = e.target
        setState({ postLimit: value })
        localStorage.setItem('postLimit', parseInt(value))
    }

    return (
        <NavDropdown title={<i className="bi bi-infinity"></i>} align="end">
            <Container>
                <Form.Label>Post Limit</Form.Label>
                <Form.Range min={10} max={100} step={10} value={state.postLimit} onChange={handlePostLimit} />
            </Container>
        </NavDropdown>
    )
}

function PostSettings() {
    const { state, setState } = useContext(StateContext)
    const { SERVER_ORIGIN } = config
    const handlePostType = (type) => setState({ postType: type })
    const [showSyncProgress, setShowSyncProgress] = useState(false)

    const [scrap, setScrap] = useState({
        scrapped: 0,
        totalUnscrapped: 0
    })

    const handleSync = async () => {
        setShowSyncProgress(true)
        await axios.get(SERVER_ORIGIN + '/scrap-progress/clear')

        const showScrapProgress = setInterval(async () => {
            const { data: { maxPost, scrapped } } = await axios.get(SERVER_ORIGIN + '/scrap-progress')
            setScrap({ scrapped, totalUnscrapped: maxPost || 0 })
        }, 3000)

        axios.get(SERVER_ORIGIN + '/sync').then(() => {
            setShowSyncProgress(false)
            setState({ postLimit: 10, pageIndex: 0 })
            clearInterval(showScrapProgress)
        })
    }

    const getVotedPosts = () => handlePostType(2)
    const getSavedPosts = () => handlePostType(1)
    const getArchivedPosts = async () => {
        const { data: posts } = await axios(SERVER_ORIGIN + '/archive')
        setState({ posts, postSearch: "Archived Posts" })
    }

    const memoSyncProgressModal = useMemo(() => {
        return <SyncProgressModal scrapped={scrap.scrapped} totalUnscrapped={scrap.totalUnscrapped} />
    }, [scrap])

    const DarkMode = () => {
        const handleToggleDarkMode = () => {
            const toggledMode = !state.darkMode
            setState({ darkMode: toggledMode })
            localStorage.setItem('darkMode', JSON.stringify(toggledMode))
        }

        const text = state.darkMode ? "Light Mode" : "Dark Mode"
        const icon = state.darkMode ? "bi bi-sun-fill" : "bi bi-moon-fill"
        const iconColor = state.darkMode ? "warning" : "dark"
        return (
            <NavDropdown.Item onClick={handleToggleDarkMode}>
                <i className={`${icon} text-${iconColor}`}></i> {text}
            </NavDropdown.Item>
        )

    }
    return (
        <NavDropdown title={<i className="bi bi-gear-fill"></i>} align="end">
            <DarkMode />
            <NavDropdown.Item onClick={getSavedPosts}><i className="bi bi-bookmark-fill text-primary"></i> Saved</NavDropdown.Item>
            <NavDropdown.Item onClick={getVotedPosts}><i className="bi bi-heart-fill text-danger"></i> Voted</NavDropdown.Item>
            <NavDropdown.Item onClick={getArchivedPosts}><i className="bi bi-archive-fill text-secondary"></i> Archived</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleSync}>
                <i className="bi bi-arrow-repeat text-warning"></i> Sync
            </NavDropdown.Item>
            {showSyncProgress && memoSyncProgressModal}
        </NavDropdown>
    )
}

/**
 * 
 * @param {Number} current Current scrapped post
 * @param {Number} scrapped Total un-scrapped post
 */
function SyncProgressModal({ scrapped, totalUnscrapped }) {
    return (
        <Modal id="tag-modal" show centered>
            <Modal.Body>
                <h2>Sync in Progress <Spinner animation="border" variant="warning" /></h2>
                <p>{scrapped} of {totalUnscrapped} post are scrapped</p>
                <p className="text-danger">Do not close, shutdown, or stop this process, it will result unexpected bugs!</p>
            </Modal.Body>
        </Modal>
    )
}
