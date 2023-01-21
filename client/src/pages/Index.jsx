import { Stack } from "react-bootstrap"
import Posts from "../components/Posts"
import PostsNavigation from "../components/PostsNavigation"
import PostsPagination from "../components/PostsPagination"
import Footer from "../components/Footer"
import { ThemeContext } from "../App";
import { useContext } from "react"
import { useMemo } from "react"
export default function Index() {

    const { state } = useContext(ThemeContext)

    const memoPagination = useMemo(() => !state.searchMode && <PostsPagination />, [state.searchMode])

    return (
        <Stack gap={4} className="p-5">
            <PostsNavigation />
            {memoPagination}
            <Posts />
            {memoPagination}
            <Footer />
        </Stack>
    )

}
