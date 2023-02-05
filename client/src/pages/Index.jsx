import { Stack } from "react-bootstrap"
import Posts from "../components/Posts"
import PostsNavigation from "../components/PostsNavigation"
import PostsPagination from "../components/PostsPagination"
import Footer from "../components/Footer"
import { ThemeContext } from "../App";
import { memo, useContext } from "react"
export default function Index() {

    const { state } = useContext(ThemeContext)
    const MemoPagination = memo(() => state.postSearch.trim().length <= 0 && <PostsPagination />, [state.searchMode])

    const Header = memo(() => {
        let header = (state.postType === 1 ? "Saved" : "Voted") + " Post"
        if (state.postSearch)
            header = `Search for '${state.postSearch}'`
        return <h3 className={state.darkMode ? "text-light" : "text-dark"}>{header}</h3>
    }, [state.postType, state.postSearch])

    return (
        <Stack gap={4} className="p-5">
            <PostsNavigation />
            <Header />
            <MemoPagination />
            <Posts />
            <MemoPagination />
            <Footer />
        </Stack>
    )
}
