import React from "react"
import axios from "axios"
import { SERVER_ORIGIN } from '../config'
import purgeStoredData from "../helper/purgeStoredData"
import Modal from 'bootstrap/js/dist/modal.js'
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../App"
import $ from 'jquery'
// import toast from "../helper/toastControl"

export default function Navigation() {
    const { state, ACTIONS, dispatch } = useContext(ThemeContext)

    const handleSubmitSearch = async e => {
        e.preventDefault()
        const { data: posts } = await axios.get(SERVER_ORIGIN + '/post/search', { params: { searchQuery: state.search } })
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, search: '', page: 1 } })
    }

    const handleSyncPost = async () => {
        const loadingDimmer = new Modal(document.getElementById('modal'))
        loadingDimmer.show()
        await axios.get(`${SERVER_ORIGIN}/post/sync`).then(() => window.location.reload())
    }

    const handleTag = async (tag) => {
        console.log(tag)
        const { data: posts } = await axios.get(SERVER_ORIGIN + '/tag/' + tag)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { posts, page: 1 } })
        $('button.btn-close')[0].click()
    }

    const handleDarkMode = () => (
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { darkMode: !state.darkMode } })
    )
    const handleChunkDropdown = () => (
        $('.chunk-dropdown > .dropdown-menu').toggleClass('show')
    )

    const handleIndexNavigation = () => {
        state.activeArray.length > 0 && dispatch({ type: ACTIONS.SET_REDUCER, payload: { activeArray: [] } })
    }

    return (
        <>
            <div id="modal" className="modal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content py-4">
                        <div className="modal-body d-flex flex-column align-items-center">
                            <h3 className="modal-title">Syncing in progress</h3>
                            <div className="spinner-border mt-3" role="status">
                                <span className="visually-hidden">Please wait...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-dark bg-primary navbar-expand-lg m-5 rounded">
                <div className="container-fluid m-2">
                    <Link className="navbar-brand" to="/" onClick={handleIndexNavigation}>NineSystem</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="mx-auto bg-light rounded-pill">
                        <div className="input-group">
                            <form id="searchForm" onSubmit={handleSubmitSearch}>
                                <div className="input-group">
                                    <button type="submit" className="btn btn-transparent border-0"><i className="bi bi-search"></i></button>
                                    <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search" value={state.search} onChange={e => dispatch({ type: ACTIONS.SET_REDUCER, payload: { search: e.target.value } })} required />
                                </div>
                            </form>
                            <button type="button" className="btn btn-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><button disabled className="dropdown-item text-dark"><i className="bi bi-question-lg"></i> Search Type</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { searchType: 'title' } })}><i className="bi bi-card-heading"></i> Title</button></li>
                                <li><button className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { searchType: 'author' } })}><i className="bi bi-person-circle"></i> Author</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-gear"></i>
                                </span>
                                <ul className="dropdown-menu m-0">
                                    <li role="button"><span className="dropdown-item text-primary" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { type: 'saved', page: 1 } })}><i className="bi bi-heart"></i> Saved</span></li>
                                    <li role="button"><span className="dropdown-item text-info" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { type: 'voted', page: 1 } })}><i className="bi bi-bookmarks"></i> Voted</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li className="chunk-dropdown " role="button" onMouseEnter={handleChunkDropdown} onMouseLeave={handleChunkDropdown}>
                                        <span className="dropdown-item text-warning"><i className="bi bi-boxes"></i> Chunks</span>
                                        <ul className="dropdown-menu m-0">
                                            <li role="button"><span className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { chunk: 5 } })}>5</span></li>
                                            <li role="button"><span className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { chunk: 10 } })}>10</span></li>
                                            <li role="button"><span className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { chunk: 30 } })}>30</span></li>
                                            <li role="button"><span className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { chunk: 60 } })}>60</span></li>
                                            <li role="button"><span className="dropdown-item" onClick={() => dispatch({ type: ACTIONS.SET_REDUCER, payload: { chunk: 100 } })}>100</span></li>
                                        </ul>
                                    </li>
                                    <li role="button"><span className="dropdown-item text-danger" onClick={handleSyncPost}><i className="bi bi-arrow-repeat"></i> Sync Post</span></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" role="button" data-bs-toggle="modal" data-bs-target="#tagModal">
                                    <i className="bi bi-tags"></i>
                                </span>
                                <div className="tag modal fade" id="tagModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-xl">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="tagModalLabel">Tags</h1>
                                                <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body d-flex justify-content-start align-items-center flex-wrap">
                                                {state.tags &&
                                                    state.tags.length > 0 &&
                                                    state.tags.map((tag, index) =>
                                                        <button key={index} onClick={() => handleTag(tag._id)} className={`btn btn-sm btn-outline-${tag.tagType === 'Custom' ? 'warning' : 'primary'} d-inline py-2 px-4 m-1`}>
                                                            {tag.title}
                                                            <span className={`badge bg-${tag.tagType === 'Custom' ? 'warning' : 'primary'} ms-2`}>{tag.postSize}</span>
                                                        </button>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" role="button" onClick={handleDarkMode}>
                                    {state.darkMode ? <i className="bi bi-brightness-high"></i> : <i className="bi bi-moon"></i>}
                                </span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" role="button" onClick={purgeStoredData}><i className="bi bi-recycle"></i></span>
                            </li>
                            <li className="nav-item">
                                <Link to="/authors" className="nav-link" role="button"><i className="bi bi-person-lines-fill"></i></Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
        </>
    )
}