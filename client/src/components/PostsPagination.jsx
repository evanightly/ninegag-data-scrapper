import { useContext } from "react"
import { ThemeContext } from "../App"
import Pagination from 'react-bootstrap/Pagination';
export default function PostsPagination() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    const handlePagination = (pageDestination) => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: pageDestination } })
    }

    const disablePrevPage = state.page <= 1

    const disableNextPage = state.page >= state.postTotal

    console.log(disableNextPage)
    return (
        <Pagination className="m-0">
            <Pagination.First
                disabled={disablePrevPage} onClick={() => handlePagination(1)} />
            <Pagination.Prev
                disabled={disablePrevPage} onClick={() => handlePagination(state.page - 1)} />
            <Pagination.Item active>{state.page}</Pagination.Item>
            <Pagination.Next
                disabled={disableNextPage}
                onClick={() => handlePagination(state.page + 1)} />
            <Pagination.Last disabled={disableNextPage} onClick={() => handlePagination(state.postTotal)} />
        </Pagination>
    )
}