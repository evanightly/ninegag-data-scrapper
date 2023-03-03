import { useEffect, useState } from "react"
import { Button, Col, Modal, Nav } from "react-bootstrap"
import ReactQuill from 'react-quill';
import config from '../config'
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

export default function Note() {
    const [show, setShow] = useState(false)
    const [note, setNote] = useState('')
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const { SERVER_ORIGIN } = config

    useEffect(() => {
        axios.get(SERVER_ORIGIN + '/note').then(result => {
            const note = result.data?.note ?? ""
            setNote(note)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleSubmit = async () => {
        if (!note.trim().length) return
        await axios.post(SERVER_ORIGIN + '/note', { note })
        alert("Note updated")
    }
    return (
        <>
            <Nav.Link role='button' onClick={handleShow}>
                <i className="bi bi-sticky-fill"></i>
            </Nav.Link>
            <Modal id="note-modal" show={show} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactQuill theme="snow" value={note} onChange={setNote} />
                    <Col className="d-flex justify-content-end pt-3">
                        <Button type="submit" variant="success" onClick={handleSubmit}>Submit</Button>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}