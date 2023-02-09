import { useDebugValue, useState } from "react"

export default function useCustomState(initialState) {
    let [state, setState] = useState(initialState)

    useDebugValue(state)
    const modifyState = object => setState(prevState => ({ ...prevState, ...object }))
    return [state, modifyState]
}