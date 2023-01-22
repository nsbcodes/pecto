import React from 'react'

import { useContext, useState, useEffect } from 'react'
import { PackContext, EditorContext } from '@/lib/context'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import { useNavigate } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { LinkContainer } from 'react-router-bootstrap'
import Modal from 'react-bootstrap/Modal'

import './Metadata.scss'

import { motion } from "framer-motion"

// Lots of logic is shared with EditingPair

export function Metadata() {
    const pack = useContext(PackContext)
    const editor = useContext(EditorContext)

    const [editing, setEditing] = useState(false)

    // Spin this out into a different component?
    // no u shithead
    const [name, setName] = useState(pack.name)
    // conflict with the keyword class
    const [packClass, setPackClass] = useState(pack.class)

    const [willDelete, startDelete] = useState(false)
    const [publish, setPublish] = useState(false)
    const [importing, importFromQuizlet] = useState(false)
    const [quizletContents, setQuizletContens] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setPublish(pack.published)
    }, [pack])

    useEffect(() => {
        if (!editing) startDelete(false)
    }, [editing])

    async function exitEditingMode() {
        // When the user clicks "Done" and the component will be switched to the static version,
        // we send a write to Firebase
        let p = pack
        p.name = name
        p.class = packClass
        p.published = publish

        editor.setPack({...p})

        // Self-destruct
        setEditing(!editing)
    }

    // sadge
    async function deletePack() {
        await deleteDoc(doc(db, "packs", pack.uuid))
        navigate('/')
    }

    function importQuizlet() {
        let cards = []
        // Split pack into cards
        const arr = quizletContents.split('⭕')
        arr.forEach(e => {
            // Split cards into term/defintion
            let a = e.split('🟢')
            cards.push({term: a[0], definition: a[1], category: "Default"})
        })

        // Remove the last (empty) element
        cards.pop()

        let p = pack
        p.content.push(...cards)
        editor.setPack({...p})
        console.log(p)

        importFromQuizlet(false)
    }

    if (editing) {
        return (
            <motion.div key="editing" animate={{ y: 0 }} initial={{ y: -50 }}>
                <Form>
                    <div className="d-flex justify-content-between">
                        <input
                            id="packName"
                            type="text"
                            value={name}
                            className="form-control w-75"
                            onChange={(e) => setName(e.target.value)}/>
                        <p>
                            Author: <LinkContainer className="link-primary" to={`/view/${pack.author}`}><b>@{pack.author}</b></LinkContainer>
                        </p>
                    </div>

                    <div className="d-flex justify-content-between">
                        <p>
                            For <input
                            id="packClass"
                            type="text"
                            value={packClass}
                            className="form-control"
                            onChange={(e) => setPackClass(e.target.value)}/>
                        </p>
                        <p>
                            Published on: <b>{pack.date}</b>
                        </p>
                    </div>
                </Form>

                <OverlayTrigger placement="top" overlay={
                    <Tooltip>
                        {publish ? 'Currently everyone can view this' : 'Currently only you can see this'}
                    </Tooltip>
                }>
                    <Button className="me-2" size="sm" variant="dark" onClick={() => setPublish(!publish)}>
                        {publish ? 'Unpublish' : 'Publish'}
                    </Button>
                </OverlayTrigger>

                <Button className="me-2" size="sm" variant="success" onClick={() => importFromQuizlet(!importing)}>Import from Quizlet</Button>

                <Button className="me-2" size="sm" onClick={exitEditingMode}>Finish editing</Button>

                {willDelete ? (
                    <Button size="sm" variant="danger" onClick={deletePack}>Are you sure?</Button>
                ) : (
                    <Button size="sm" variant="warning" onClick={() => startDelete(true)}>Delete</Button>
                )}

                <Modal show={importing} onHide={() => importFromQuizlet(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Quizlet Integration</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        This only works if you are the creator
                        <ol>
                            <li>Click the <span className="badge bg-dark">⋯</span> menu</li>
                            <li>Press <span className="badge bg-primary">Export</span></li>
                            <li>Paste <span className="badge bg-dark">🟢</span> in <b>Custom</b> for <b>Between term and definition</b></li>
                            <li>Paste <span className="badge bg-dark">⭕</span> in <b>Custom</b> for <b>Between rows</b></li>
                            <li>Click <span className="badge bg-primary">Copy Text</span></li>
                            <li>Paste it below:</li>
                        </ol>
                        <input
                            type="text"
                            value={quizletContents}
                            onChange={(e) => setQuizletContens(e.target.value)}
                            className="form-control"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={importQuizlet}>
                            Done
                        </Button>
                    </Modal.Footer>
                </Modal>
            </motion.div>
        )
    } else {
        return (
            <motion.div key="normal" animate={{ x: 0 }} initial={{ x: -100 }}>
                <div className="d-flex justify-content-between">
                    <h1 id="packName">
                        {(pack.name == '') ? <span className='text-muted'>My Pack</span> : (
                            <span>{pack.name}</span>
                        )}
                    </h1>
                    <p>
                        Author: <LinkContainer className="link-primary" to={`/view/${pack.author}`}><b>@{pack.author}</b></LinkContainer>
                    </p>
                </div>

                <div className="d-flex justify-content-between">
                    <p>
                        For {(pack.class == '') ? (
                            <span className='text-muted'>My Class</span>
                        ) : <b>{pack.class}</b>}
                    </p>
                    <p>
                        Published on: <b>{pack.date}</b>
                    </p>
                </div>

                <div className="d-flex justify-content-between">
                    <Button size="sm" onClick={() => {navigator.clipboard.writeText(window.location.href)}}>
                        📋 Copy
                    </Button>

                    {editor.editor ? (
                        <Button size="sm" variant="dark" onClick={() => setEditing(!editing)}>
                            Edit Metadata
                        </Button>
                    ) : null}
                </div>
            </motion.div>
        )
    }
}
