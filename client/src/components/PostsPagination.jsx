import { useContext } from "react"
import { ThemeContext } from "../App"
import Pagination from 'react-bootstrap/Pagination';
import { useMemo } from "react";
import { useCallback } from "react";
export default function PostsPagination() {
    const { ACTIONS, state, dispatch } = useContext(ThemeContext)

    const handlePagination = useCallback((pageDestination) => {
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { page: pageDestination } })
    }, [ACTIONS, dispatch])

    const disablePrevPage = state.page <= 1

    const disableNextPage = state.page >= state.postTotal

    const memoPrev = useMemo(() => {
        return (
            <>
                <Pagination.First
                    disabled={disablePrevPage}
                    onClick={() => handlePagination(1)} />
                <Pagination.Prev
                    disabled={disablePrevPage}
                    onClick={() => handlePagination(state.page - 1)} />
            </>
        )
    }, [state.page, disablePrevPage, handlePagination])

    const memoNext = useMemo(() => {
        return (
            <>
                <Pagination.Next
                    disabled={disableNextPage}
                    onClick={() => handlePagination(state.page + 1)} />

                <Pagination.Last
                    disabled={disableNextPage}
                    onClick={() => handlePagination(state.postTotal)} />
            </>
        )
    }, [disableNextPage, handlePagination, state.page, state.postTotal])

    const jumpPrevPage = useMemo(() => {
        if (state.page > 4) {
            return (
                <>
                    <Pagination.Item onClick={() => handlePagination(state.page - 3)}>{state.page - 3}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page - 2)}>{state.page - 2}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page - 1)}>{state.page - 1}</Pagination.Item>
                </>
            )
        } else if (state.page > 3) {
            return (
                <>
                    <Pagination.Item onClick={() => handlePagination(state.page - 2)}>{state.page - 2}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page - 1)}>{state.page - 1}</Pagination.Item>
                </>
            )
        }

    }, [handlePagination, state.page])

    const jumpNextPage = useMemo(() => {
        if (state.page < (state.postTotal - 4)) {
            return (
                <>
                    <Pagination.Item onClick={() => handlePagination(state.page + 1)}>{state.page + 1}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page + 2)}>{state.page + 2}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page + 3)}>{state.page + 3}</Pagination.Item>
                </>
            )
        } else if (state.page < (state.postTotal - 3)) {
            return (
                <>
                    <Pagination.Item onClick={() => handlePagination(state.page + 1)}>{state.page + 1}</Pagination.Item>
                    <Pagination.Item onClick={() => handlePagination(state.page + 2)}>{state.page + 2}</Pagination.Item>
                </>
            )
        }

    }, [handlePagination, state.page, state.postTotal])
    return (
        <Pagination className="m-0">
            {memoPrev}

            {state.page > 1 && <Pagination.Item onClick={() => handlePagination(1)}>1</Pagination.Item>}
            {state.page > 1 && <Pagination.Ellipsis />}

            {jumpPrevPage}

            <Pagination.Item active>{state.page}</Pagination.Item>

            {jumpNextPage}

            {state.page < state.postTotal && <Pagination.Ellipsis />}
            {state.page < state.postTotal && <Pagination.Item onClick={() => handlePagination(state.postTotal)}>{state.postTotal}</Pagination.Item>}

            {memoNext}
        </Pagination>
    )
}