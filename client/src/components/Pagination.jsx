import React, { useContext } from "react"
import { ThemeContext } from "../App"
import { useMemo } from "react"
export default function Pagination() {
    const { state, ACTIONS, dispatch } = useContext(ThemeContext)

    // const handleDisableNextPagination = () => {
    //     if (state.totalPosts > 0) {
    //         if (state.page >= state.totalPosts.length) {
    //             return true
    //         }
    //     } else {
    //         if (state.page >= state.totalPosts.length) {
    //             return true
    //         }
    //     }
    // }

    const handleBackPagination = {
        backward() {
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: state.page - 1 } })
        },
        fastBackward() {
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: 1 } })
        }
    }

    const handleForwardPagination = {
        forward() {
            dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: state.page + 1 } })
        },
        fastForward() {
            if (state.activeArray.length > 0) {
                dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: state.activeArray.length } })
            } else {
                dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: state[state.type].length } })
            }
        }
    }

    const postTotal = useMemo(() => Math.ceil(state.postTotal / state.chunk), [state.postTotal, state.chunk])

    return (
        <nav>
            <ul className="pagination m-0">
                <li className="page-item"><button className="page-link" onClick={handleBackPagination.fastBackward}> &laquo; </button></li>
                <li className="page-item"><button className="page-link" onClick={handleBackPagination.backward} disabled={state.page <= 1}> Prev </button></li>
                <li className="page-item"><button className="page-link text-secondary" disabled> {state.page} </button></li>
                <li className="page-item"><button className="page-link text-secondary" disabled> {postTotal} </button></li>
                <li className="page-item"><button className="page-link" onClick={handleForwardPagination.forward}> Next </button></li>
                <li className="page-item"><button className="page-link" onClick={handleForwardPagination.fastForward}> &raquo; </button></li>
            </ul>
        </nav>
    )
}