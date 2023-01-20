import React, { useContext } from "react"
import $ from "jquery"
import toast from "../helper/toastControl"
import { ThemeContext } from "../App"
const Toast = ({ title, body, color = "#00ff00" }) => {
    const { state, ACTIONS, dispatch } = useContext(ThemeContext)
    setTimeout(() => {
        $('.toast').fadeOut()
        toast(ACTIONS, state, dispatch).pop()
    }, 3000)
    return (
        <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill={color}></rect></svg>
                <strong className="me-auto">{title}</strong>
                <small className="text-muted">just now</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {body}
            </div>
        </div>
    )
}


const Toasts = ({ toasts }) => {
    const { state, ACTIONS, dispatch } = useContext(ThemeContext)
    return (
        <div className="toast-container position-sticky bottom-0 start-100 p-3 ">
            {toasts && toasts.length > 0 && toasts.map((v, i) => <Toast ACTIONS={ACTIONS} state={state} dispatch={dispatch} key={i} title={v.title} body={v.body} color={v.color} />)}
        </div>
    )
}

export { Toasts, Toast }