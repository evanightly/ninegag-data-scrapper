import toast from "./toastControl"
import { SERVER_ORIGIN } from '../config/index.json'
import axios from "axios"

export default function tag(voted, saved, ACTIONS, globalState, dispatch) {
    const create = async (postId, title) => {
        await voted.forEach((posts, chunkIndex) => posts.forEach(async (post, postIndex) => {
            if (post.id === postId) {
                await axios.post(`${SERVER_ORIGIN}/tag`, { postId, title  }).then((result) => {
                    if (typeof result.data === "object") {
                        let arr = voted[chunkIndex][postIndex]
                        arr.categories.push(result.data)
                        voted[chunkIndex][postIndex] = arr
                        dispatch({ type: ACTIONS.SET_REDUCER, payload: { voted } })
                        toast(ACTIONS, globalState, dispatch).push({ title: "Success", body: "Tag Updated" })
                    } else toast(ACTIONS, globalState, dispatch).push({ title: "Failed", body: "Tag already exist!", color: '#dc3545' })
                })
            }
        }))

        await saved.forEach((posts, chunkIndex) => posts.forEach(async (post, postIndex) => {
            if (post.id === postId) {
                await axios.post(`${SERVER_ORIGIN}/tag`, { postId, title  }).then((result) => {
                    if (typeof result.data === "object") {
                        let arr = saved[chunkIndex][postIndex]
                        arr.categories.push(result.data)
                        saved[chunkIndex][postIndex] = arr
                        dispatch({ type: ACTIONS.SET_REDUCER, payload: { saved } })
                        toast(ACTIONS, globalState, dispatch).push({ title: "Success", body: "Tag Updated" })
                    } else toast(ACTIONS, globalState, dispatch).push({ title: "Failed", body: "Tag already exist!", color: '#dc3545' })
                })
            }
        }))
    }

    const remove = async (post_id, categoryId) => {
        const result = await axios.post(`${SERVER_ORIGIN}/tag/remove`, { post_id, categoryId })
        if (result.data) {
            await voted.forEach((posts, chunkIndex) => posts.forEach(async (post, postIndex) => {
                if (post._id === post_id) {
                    let arr = voted[chunkIndex][postIndex]
                    let newCategories = arr.categories.filter(category => category._id !== categoryId)
                    arr.categories = newCategories
                    voted[chunkIndex][postIndex] = arr
                    dispatch({ type: ACTIONS.SET_REDUCER, payload: { voted } })
                    toast(ACTIONS, globalState, dispatch).push({ title: "Success", body: "Tag Deleted" })
                }
            }))

            await saved.forEach((posts, chunkIndex) => posts.forEach(async (post, postIndex) => {
                if (post._id === post_id) {
                    let arr = saved[chunkIndex][postIndex]
                    let newCategories = arr.categories.filter(category => category._id !== categoryId)
                    arr.categories = newCategories
                    saved[chunkIndex][postIndex] = arr
                    dispatch({ type: ACTIONS.SET_REDUCER, payload: { saved } })
                    toast(ACTIONS, globalState, dispatch).push({ title: "Success", body: "Tag Deleted" })
                }
            }))
        }
        else console.log("Something went wrong")
    }

    return { create, remove }
}