const toast = (ACTIONS, state, dispatch) => {
    let toasts = state.toasts
    const push = (payload) => {
        toasts.push(payload)
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { toasts } })
    }
    const pop = () => {
        toasts.pop()
        dispatch({ type: ACTIONS.SET_REDUCER, payload: { toasts } })
    }

    return { push, pop }
}

module.exports = toast