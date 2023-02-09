import { Pagination } from "react-bootstrap";
import { StateContext } from "../pages/Posts";
import { useContext } from "react";

export default function PostPagination() {
    const { state: { pageIndex, postTotal, postSearch }, setState } = useContext(StateContext)
    const displayLimit = 2 // Must be more than equal of 1
    const currentPage = pageIndex + 1
    const handlePage = (page) => setState({ pageIndex: page })
    const handleFirstPage = () => handlePage(0)
    const handleNextPage = () => handlePage(currentPage)
    const handlePrevPage = () => handlePage(pageIndex - 1)
    const handleLastPage = () => handlePage(postTotal - 1)

    const PrevPagination = () => {
        const elements = []
        for (let index = displayLimit; index >= 1; index--) {
            let page = currentPage - index
            elements.push(<Pagination.Item key={index} onClick={() => handlePage(page - 1)}>{page}</Pagination.Item>)
        }
        return elements
    }

    const NextPagination = () => {
        if (currentPage >= postTotal) return
        const elements = []
        for (let index = displayLimit; index >= 1; index--) {
            let page = (currentPage) + index
            if (page < postTotal)
                elements.push(<Pagination.Item key={index} onClick={() => handlePage(page - 1)}>{page}</Pagination.Item>)
        }
        return elements.reverse()
    }

    const ShowPrevPagination = () => {
        if (currentPage > displayLimit) {
            return (
                <>
                    <Pagination.Ellipsis />
                    <PrevPagination />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <NextPagination />
                </>
            )
        }
    }

    const ShowNextPagination = () => {
        if (currentPage < postTotal) {
            return (
                <>
                    <Pagination.Ellipsis />
                    <Pagination.Item>{postTotal}</Pagination.Item>
                </>
            )
        }
    }

    const ShowNext = () => {
        if (currentPage < postTotal) {
            return <Pagination.Next onClick={handleNextPage} />
        }
    }

    const ShowPrev = () => {
        if (currentPage > 1) {
            return <Pagination.Prev onClick={handlePrevPage} />
        }
    }

    const MainPostPagination = () => {
        if (postSearch.trim().length <= 0) {
            return (
                <Pagination id="post-pagination" className="m-0">
                    <Pagination.First onClick={handleFirstPage} />
                    <ShowPrev />
                    <Pagination.Item active={currentPage <= displayLimit}>{currentPage <= displayLimit ? currentPage : 1}</Pagination.Item>
                    <ShowPrevPagination />
                    <ShowNextPagination />
                    <ShowNext />
                    <Pagination.Last onClick={handleLastPage} />
                </Pagination>
            )
        }
    }

    return <MainPostPagination />
}