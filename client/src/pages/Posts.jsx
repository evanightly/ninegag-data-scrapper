import { Stack } from "react-bootstrap"
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Post from "../components/Post"
import { createContext, memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import config from '../config'
import axios from 'axios'
import PostPagination from "../components/PostPagination"
import PostNavbar from "../components/PostNavbar"
import useCustomState from "../hooks/useCustomState"
import PostFooter from "../components/PostFooter"
import $ from 'jquery'

const { SERVER_ORIGIN } = config

export const StateContext = createContext()
export const TagContext = createContext()

export default function Posts() {

    const initialState = {
        pageIndex: 0,
        postType: 1, // 1: Saved, 2: Voted
        postLimit: 10,
        postTotal: 0,
        postSearch: "",
        posts: [],
    }

    const [isPending, startTransition] = useTransition()
    const [state, setState] = useCustomState(initialState)
    const { postType, pageIndex, postLimit } = state

    const [tag, setTag] = useState([])
    // useLayoutEffect(() => setTag(state.tags), [state.tags])

    const loadPostTotal = useCallback(async () => {
        const getPostTotal = `${SERVER_ORIGIN}/post/total/${postType}`
        const { data: total } = await axios.get(getPostTotal)
        const postTotal = Math.ceil(total / postLimit) // Counted as chunk
        setState({ postTotal })
        // eslint-disable-next-line
    }, [state.postLimit, state.postType])

    const loadPosts = useCallback(async () => {
        const getPost = `${SERVER_ORIGIN}/post/${postType}/${pageIndex * postLimit}/${postLimit}`
        const { data: posts } = await axios.get(getPost)
        setState({ posts })
        // eslint-disable-next-line
    }, [state.postType])

    const loadTags = useCallback(async () => {
        const getTag = `${SERVER_ORIGIN}/tag/`
        const { data: tags } = await axios.get(getTag)
        setTag(tags)
    }, [])

    const initialize = useCallback(() => {
        loadPosts()
        loadTags()
        setState({ postSearch: "", postType: 1, pageIndex: 0, postLimit: 10 })
    }, [loadPosts, loadTags, setState])

    useEffect(() => {
        startTransition(initialize)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        loadPosts()
    }, [loadPosts])

    useEffect(() => {
        loadPostTotal()
        // eslint-disable-next-line
    }, [loadPostTotal])

    useEffect(() => {
        const loadNextPost = async () => {
            const getPost = `${SERVER_ORIGIN}/post/${postType}/${pageIndex * postLimit}/${postLimit}`
            const { data: posts } = await axios.get(getPost)
            setState({ posts })
        }
        startTransition(loadNextPost)
        // eslint-disable-next-line
    }, [state.postLimit, state.pageIndex])

    useEffect(() => {
        if (state.darkMode) {
            $('body').addClass('darkMode')
        } else {
            $('body').removeClass('darkMode')
        }
    }, [state.darkMode])
    const customTags = useMemo(() => tag.filter(tag => tag.tagType === "Custom"), [tag])

    const MemoPosts = useMemo(() => {
        const masonryBreakpoints = {
            // Breakpoint: row count
            360: 1,
            775: 2,
            1155: 3,
            1550: 4,
            1800: 5
        }

        const renderPosts = state.posts.length > 0
            ? state.posts.map((post, index) => <Post key={post._id} post={post} />)
            : <p>Post not found</p>

        return (
            isPending
                ? "Loading"
                : <ResponsiveMasonry
                    columnsCountBreakPoints={masonryBreakpoints}>
                    <Masonry gutter="70px">
                        {renderPosts}
                    </Masonry>
                </ResponsiveMasonry>
        )
    }, [isPending, state.posts])

    const MemoPostNavbar = useMemo(() => <PostNavbar />, [])

    // Debug
    const renderTime = useRef(0)
    useEffect(() => {
        renderTime.current = renderTime.current + 1
        console.log("renderTime: ", renderTime.current)
    }, [])

    const MemoPostPagination = memo(() => <PostPagination />, [state.posts])

    const Header = () => {
        let headerText = (state.postType === 1 ? "Saved" : "Voted") + " Post"
        if (state.postSearch.length > 0) {
            headerText = `Search for ${state.postSearch}`
        }
        return <h3 id="post-header" className="m-0">{headerText}</h3>

    }
    return (
        <StateContext.Provider value={{ state, setState, initialize }}>
            <TagContext.Provider value={{ tag, customTags, loadTags }}>
                <Stack gap={4} className="p-5">
                    {MemoPostNavbar}
                    <Header />
                    <MemoPostPagination />
                    {MemoPosts}
                    <PostFooter />
                </Stack>
            </TagContext.Provider>
        </StateContext.Provider>
    )
}
