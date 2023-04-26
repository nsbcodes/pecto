import React from 'react'

import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { LinkContainer } from 'react-router-bootstrap'
import Modal from 'react-bootstrap/Modal'

import './Metadata.scss'

import { usePack } from '@/stores/pack'
import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

// Lots of logic is shared with EditingPair

export function Metadata(props) {
	const [editing, setEditing] = useState(false)
	const [deletePack] = useUser((state) => [state.deletePack], shallow)
	const [pack, togglePublish, editClass, editName, addQuizletCards, canEdit] = usePack(
		(state) => [
			// Data
			state.pack,
			state.togglePublish,
			state.editClass,
			state.editName,
			state.addQuizletCards,
			// Editing
			state.canEdit,
		],
		shallow
	)

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

	// why is this here???
	useEffect(() => {
		setPublish(pack.published)
	}, [pack])

	useEffect(() => {
		setEditing(props.editing)
	}, [props.editing])

	useEffect(() => {
		if (!editing) startDelete(false)
	}, [editing])

	async function exitEditingMode() {
		// When the user clicks "Done" and the component will be switched to the static version,
		// we send a write to Firebase
		editName(name)
		editClass(packClass)
		togglePublish(publish)

		// Self-destruct
		setEditing(!editing)
	}

	// sadge
	async function deleteP() {
		await deletePack(pack.id)
		navigate('/')
	}

	function importQuizlet() {
		addQuizletCards(quizletContents)
		importFromQuizlet(false)
	}

	if (editing) {
		return (
			<div key="editing">
				<Form>
					<input
						id="packNameX"
						type="text"
						value={name}
						className="form-control form-control-lg"
						onChange={(e) => setName(e.target.value)}
					/>
					<div className="d-flex justify-content-around mt-3 mb-3 align-items-center">
						<div className="row g-0 align-items-center">
							<div className="col-auto">For</div>
							<div className="col-auto">
								<input
									id="packClass"
									type="text"
									value={packClass}
									className="form-control form-control-sm ms-2"
									onChange={(e) => setPackClass(e.target.value)}
								/>
							</div>
						</div>
						<div>
							Created by{' '}
							<LinkContainer className="link-primary" to={`/view/${pack.author}`}>
								<b>{pack.superficialAuthor}</b>
							</LinkContainer>
						</div>
						<div>
							Published on <b>{pack.date}</b>
						</div>
					</div>
				</Form>

				<div className="d-flex justify-content-between">
					<div>
						<OverlayTrigger
							placement="top"
							overlay={
								<Tooltip>
									{publish
										? 'Currently everyone can view this'
										: 'Currently only you can see this'}
								</Tooltip>
							}
						>
							<Button
								className="me-2"
								size="sm"
								variant="dark"
								onClick={() => setPublish(!publish)}
							>
								{publish ? 'Unpublish' : 'Publish'}
							</Button>
						</OverlayTrigger>
						<Button
							className="me-2"
							size="sm"
							variant="success"
							onClick={() => importFromQuizlet(!importing)}
						>
							Import from Quizlet
						</Button>
						{!props?.editing && (
							<Button className="me-2" size="sm" onClick={exitEditingMode}>
								Finish editing
							</Button>
						)}
					</div>

					<div>
						{willDelete ? (
							<>
								<Button
									size="sm"
									className="me-2"
									variant="warning"
									onClick={() => startDelete(false)}
								>
									Cancel
								</Button>
								<Button size="sm" variant="danger" onClick={deleteP}>
									Are you sure?
								</Button>
							</>
						) : (
							<Button size="sm" variant="warning" onClick={() => startDelete(true)}>
								Delete
							</Button>
						)}
					</div>
				</div>

				<Modal show={importing} onHide={() => importFromQuizlet(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Quizlet Integration</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						This only works if you are the creator
						<ol>
							<li>
								Click the <span className="badge bg-dark">⋯</span> menu
							</li>
							<li>
								Press <span className="badge bg-primary">Export</span>
							</li>
							<li>
								Paste <span className="badge bg-dark">🟢</span> in <b>Custom</b> for{' '}
								<b>Between term and definition</b>
							</li>
							<li>
								Paste <span className="badge bg-dark">⭕</span> in <b>Custom</b> for{' '}
								<b>Between rows</b>
							</li>
							<li>
								Click <span className="badge bg-primary">Copy Text</span>
							</li>
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
			</div>
		)
	} else {
		return (
			<div key="normal">
				<div className="d-flex align-items-center justify-content-between">
					<h1 id="packName">
						{pack.name == '' ? (
							<span className="text-muted">My Pack</span>
						) : (
							<span>{pack.name}</span>
						)}
					</h1>
					<p>
						Author:{' '}
						<LinkContainer className="link-primary" to={`/view/${pack.author}`}>
							<b>@{pack.author}</b>
						</LinkContainer>
					</p>
				</div>

				<div className="d-flex justify-content-between">
					<p>
						For{' '}
						{pack.class == '' ? (
							<span className="text-muted">My Class</span>
						) : (
							<b>{pack.class}</b>
						)}
					</p>
					<p>
						Published on: <b>{pack.date}</b>
					</p>
				</div>

				<div className="d-flex justify-content-between">
					<Button
						size="sm"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href)
						}}
					>
						📋 Copy
					</Button>

					{canEdit ? (
						<Button size="sm" variant="dark" onClick={() => setEditing(!editing)}>
							Edit Metadata
						</Button>
					) : null}
				</div>
			</div>
		)
	}
}
