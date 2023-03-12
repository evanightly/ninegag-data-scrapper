/* eslint-disable react-hooks/exhaustive-deps */

import { Stack } from "react-bootstrap"
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Post from "../components/Post"
import { createContext, useCallback, useEffect, useMemo, useState, useTransition } from "react"
import config from '../config'
import axios from 'axios'
import PostPagination from "../components/PostPagination"
import PostNavbar from "../components/PostNavbar"
import useCustomState from "../hooks/useCustomState"
import PostFooter from "../components/PostFooter"
import $ from 'jquery'

export const StateContext = createContext()
export const TagContext = createContext()

const { SERVER_ORIGIN } = config
const initialState = {
    darkMode: true,
    pageIndex: 0,
    postType: 1, // 1: Saved, 2: Voted
    postLimit: 10,
    postTotal: 0,
    postSearch: "",
    posts: [],
}

export default function Posts() {
    const [isPending, startTransition] = useTransition()
    const [state, setState] = useCustomState(initialState)
    const [tag, setTag] = useState([])

    const { darkMode, postType, pageIndex, postLimit, postSearch, posts, } = state

    /**
     * This function is responsible for next post when certain state changed
     * 
     * Triggered state:
     * - postLimit
     * - pageIndex
     * - postType
     */
    const loadPosts = useCallback(async () => {
        const getPost = `${SERVER_ORIGIN}/post/${postType}/${pageIndex * postLimit}/${postLimit}`
        const { data: posts } = await axios.get(getPost)
        return setState({ posts })
    }, [postLimit, pageIndex, postType])

    /**
     * This function is responsible for getting tags
     */
    const loadTags = useCallback(async () => {
        const getTag = `${SERVER_ORIGIN}/tag/`
        const { data: tags } = await axios.get(getTag)
        return setTag(tags)
    }, [])

    /**
     * This function is responsible for getting user settings from localStorage
     */
    const loadUserSettings = useCallback(() => {
        localStorage.getItem('darkMode')
            ? setState({ darkMode: JSON.parse(localStorage.getItem('darkMode')) })
            : localStorage.setItem('darkMode', JSON.stringify(darkMode))

        localStorage.getItem('postLimit')
            ? setState({ postLimit: JSON.parse(localStorage.getItem('postLimit')) })
            : localStorage.setItem('postLimit', JSON.stringify(postLimit))
    }, [])

    /**
     * This function is responsible for getting total of each post type when certain state changed
     * 
     * Triggered state:
     * - postLimit
     * - postType
     */
    const loadPostTotal = useCallback(async () => {
        const getPostTotal = `${SERVER_ORIGIN}/post/total/${postType}`
        const { data: total } = await axios.get(getPostTotal)
        const postTotal = Math.ceil(total / postLimit) // Counted as chunk
        setState({ postTotal })
    }, [postLimit, postType])

    /**
     * This function is responsible for handling dark mode when darkMode state changed
     */
    const loadDarkMode = useCallback(() => {
        darkMode
            ? $('body').addClass('darkMode')
            : $('body').removeClass('darkMode')
    }, [darkMode])

    /**
     * This function is responsible for getting posts and tags when first load
     */
    const initialize = useCallback(() => {
        console.log("Exec")
        loadPosts()
        loadTags()
        loadPostTotal()
        setState(initialState)
    }, [])

    useEffect(() => {
        loadUserSettings()
        loadDarkMode()
        loadTags()
    }, [darkMode])

    useEffect(() => {
        loadPostTotal()
    }, [loadPostTotal])

    useEffect(() => {
        startTransition(loadPosts)
    }, [loadPosts])

    const MemoPosts = useMemo(() => {
        const masonryBreakpoints = {
            // Breakpoint: row count
            360: 1,
            775: 2,
            1155: 3,
            1550: 4,
            1800: 5
        }

        const renderPosts = posts.length > 0
            ? posts.map(post => <Post key={post._id} post={post} />)
            : <p>Post not found</p>

        return (
            isPending
                ? "Loading"
                : <ResponsiveMasonry
                    columnsCountBreakPoints={masonryBreakpoints}>
                    <Masonry gutter="70px">{renderPosts}</Masonry>
                </ResponsiveMasonry>
        )
    }, [isPending, posts])

    const MemoPostNavbar = useMemo(() => <PostNavbar />, [])
    const MemoPostPagination = useMemo(() => <PostPagination />, [])
    const MemoFooter = useMemo(() => <PostFooter />, [])
    const MemoHeader = useMemo(() => {
        let headerText = postSearch.length > 0
            ? `Search for ${postSearch}`
            : (postType === 1 ? "Saved" : "Voted") + " Post"
        return <h3 id="post-header" className="m-0">{headerText}</h3>
    }, [postType, postSearch])

    const customTags = useMemo(() => tag.filter(tag => tag.tagType === "Custom"), [tag])
    return (
        <StateContext.Provider value={{ state, setState, initialize }}>
            <TagContext.Provider value={{ tag, customTags, loadTags }}>
                <Stack gap={4} className="p-5">
                    {MemoPostNavbar}
                    {MemoHeader}
                    {MemoPostPagination}
                    {MemoPosts}
                    {MemoPostPagination}
                    {MemoFooter}
                </Stack>
            </TagContext.Provider>
        </StateContext.Provider>
    )
}
