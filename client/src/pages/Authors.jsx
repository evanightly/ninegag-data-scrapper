import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../App"
export default function Authors() {
    const { state: globalState, ACTIONS, dispatch } = useContext(ThemeContext)

    const [state, setState] = useState({
        authors: [],
        orderType: 'desc'
    })

    const navigate = useNavigate();

    useEffect(() => {
        sort()
    }, [])

    const sort = (by = 'author') => {
        const { authors } = globalState

        if (by === 'author') {
            if (state.orderType === 'desc') {
                authors.sort((a, b) => {
                    if (a.person < b.person) {
                        return -1;
                    }
                    if (b.person < a.person) {
                        return 1;
                    }
                    return 0;
                })
                setState(state => ({ ...state, orderType: 'asc' }))
            } else if (state.orderType === 'asc') {
                authors.sort((a, b) => {
                    if (a.person > b.person) {
                        return -1;
                    }
                    if (b.person > a.person) {
                        return 1;
                    }
                    return 0;
                })
                setState(state => ({ ...state, orderType: 'desc' }))
            }
        } else if (by === 'posts') {
            if (state.orderType === 'desc') {
                authors.sort((a, b) => {
                    if (a.posts.length < b.posts.length) {
                        return -1;
                    }
                    if (b.posts.length < a.posts.length) {
                        return 1;
                    }
                    return 0;
                })
                setState(state => ({ ...state, orderType: 'asc' }))
            } else if (state.orderType === 'asc') {
                authors.sort((a, b) => {
                    if (a.posts.length > b.posts.length) {
                        return -1;
                    }
                    if (b.posts.length > a.posts.length) {
                        return 1;
                    }
                    return 0;
                })
                setState(state => ({ ...state, orderType: 'desc' }))
            }
        }
        setState(state => ({ ...state, authors }))
    }

    const handleSearchOnClick = (author) => {
        let { saved, voted } = globalState
        const [savedObj, votedObj] = [[], []] // Preparing empty array for unpacked chunks of saved, voted posts
        saved.map(s => s.map(obj => savedObj.push(obj))) // pushing chunk objects to savedObj array
        voted.map(v => v.map(obj => votedObj.push(obj)))

        let filteredSaved, filteredVoted
        filteredSaved = savedObj.filter(s => s.author.toLowerCase().indexOf(author.person.toLowerCase()) > -1)
        filteredVoted = votedObj.filter(v => v.author.toLowerCase().indexOf(author.person.toLowerCase()) > -1)
        const result = [...filteredSaved, ...filteredVoted]
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { activeArray: result } })
        navigate('/')
    }

    return (
        <div className="container">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col" onClick={() => sort('author')} role="button">Author</th>
                        <th scope="col" onClick={() => sort('posts')} role="button"># Posts</th>
                    </tr>
                </thead>
                <tbody>
                    {state.authors.length > 0 && state.authors.map((author, num) => (
                        <tr key={num} role="button" onClick={() => handleSearchOnClick(author)}>
                            <td>{num + 1}</td>
                            <td>{author.person}</td>
                            <td>{author.posts.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}