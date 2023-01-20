import React, { useContext, useMemo, Suspense, lazy } from "react";
import { ThemeContext } from "../App"
import Pagination from "../components/Pagination";
import { Toasts } from "../components/Toasts";
import $ from 'jquery'
export default function Index() {
    const Posts = lazy(() => import('../components/Posts'))

    const { state } = useContext(ThemeContext)

    useMemo(() => {
        state.darkMode ? $('body').addClass('darkMode') : $('body').removeClass('darkMode')
    }, [state.darkMode])

    useMemo(() => {
        window.scrollTo(0, 0)
    }, [state.page])

    const IndexMainLayout = () => (
        <div className="container-fluid px-5">
            <div className="d-flex justify-content-between">
                <h3 className="d-inline">{state.postType === 1 ? 'Saved' : 'Voted'} Post</h3>
                {memoPagination}
            </div>
            <div className="row">
                <Suspense fallback={`loading...`}>
                    <Posts />
                </Suspense>
            </div>
            <div className="d-flex justify-content-end">
                {memoPagination}
            </div>
        </div>
    )

    const IndexFixedMenu = () => (
        <div id="backToTop" className="position-fixed d-flex flex-column" role="group">
            <div className="btn-group-vertical">
                <button className="btn btn-light text-primary rounded" onClick={() => window.scrollTo(0, 0)}>
                    <i className="bi bi-arrow-up"></i>
                </button>
            </div>
        </div>
    )

    const IndexFooter = () => (
        <div className="container-fluid bg-dark p-2 ps-3 text-secondary">
            Courtesy &copy; Evanity
        </div>
    )

    const memoPagination = useMemo(() => <Pagination />, [])

    const memoToasts = useMemo(() => <Toasts />, [])

    const memoIndexFixedMenu = useMemo(() => <IndexFixedMenu />, [])

    const memoIndexMainLayout = useMemo(() => <IndexMainLayout />, [])

    const memoIndexFooter = useMemo(() => <IndexFooter />, [])
    return (
        <>
            {memoToasts}
            {memoIndexMainLayout}
            {memoIndexFooter}
            {memoIndexFixedMenu}
        </>
    )
}
