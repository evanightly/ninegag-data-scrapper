import { Col, Container, Row } from "react-bootstrap";

export default function Footer() {
    return (
        <Container fluid className="footer bg-primary rounded text-light">
            <Row>
                <Col>
                    <p className="m-0 my-3">
                        <i className="bi bi-c-circle"></i> {' '}
                        Copyright {new Date().getFullYear()} - {' '}
                        <a
                            href="https://github.com/evanightly"
                            target="_blank"
                            className="text-light"
                            rel="noreferrer">Evanightly</a>
                    </p>
                </Col>
            </Row>
        </Container>
    )
}