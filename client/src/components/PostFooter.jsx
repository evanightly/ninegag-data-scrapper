import { Container } from "react-bootstrap";

export default function PostFooter() {
    const date = new Date().getFullYear()
    return (
        <Container fluid className="bg-dark text-light p-3 rounded">
            Copyright {date} &copy; <a className="text-light" href="https://github.com/evanightly" target="_blank" rel="noreferrer">Evanightly</a>
        </Container>
    )
}