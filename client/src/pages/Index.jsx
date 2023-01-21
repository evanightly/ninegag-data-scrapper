import { Stack } from "react-bootstrap"
import Posts from "../components/Posts"
import PostsNavigation from "../components/PostsNavigation"
import PostsPagination from "../components/PostsPagination"
import Footer from "../components/Footer"
export default function Index() {

    return (
        <Stack gap={4} className="p-5">
            <PostsNavigation />
            <PostsPagination />
            <Posts />
            <PostsPagination />
            <Footer />
        </Stack>
    )

}
