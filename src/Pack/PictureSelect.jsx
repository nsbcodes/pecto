import React, { useState, useContext } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import { CardsContext } from '@/lib/context.js'
import { truncateString } from '@/lib/utilities'

export function PictureSelect() {
	const cards = useContext(CardsContext)
	const [pack, addPicture, setCardPicture, removeCardPicture] = usePack(
		(state) => [
			// Data
			state.pack,
			state.addPicture,
			state.setCardPicture,
			state.removeCardPicture,
		],
		shallow
	)

	// Valid URL
	const [validURL, setValidURL] = useState(false)

	// New Category modal
	const [show, setShow] = useState(false)
	const [newPicture, setNewPicture] = useState('')

	return (
		<>
			<Dropdown>
				<Dropdown.Toggle
					size="sm"
					className="ms-2"
					variant="outline-light rounded-3 text-muted"
					tabIndex="-1"
				>
					{cards?.picture ? truncateString(cards.picture, 15) : 'No Picture'}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item onClick={() => removeCardPicture(cards.id)}>
						Remove Picture
					</Dropdown.Item>
					{pack.pictures.map((picture) => (
						<div key={picture}>
							<Dropdown.Item onClick={() => setCardPicture(cards.id, picture)}>
								{picture}
							</Dropdown.Item>
						</div>
					))}
					<li>
						<hr className="dropdown-divider" />
					</li>
					<Dropdown.Item
						className="text-center"
						onClick={() => {
							setNewPicture('')
							setShow(true)
						}}
					>
						New
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

			{/* New Category Modal */}
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>New Picture</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input
						type="text"
						value={newPicture}
						onChange={(e) => {
							if (
								pack.pictures.includes(e.target.value) ||
								!e.target.value.startsWith('http') ||
								!e.target.value.includes('.') ||
								!e.target.value.includes('://') ||
								e.target.value.includes(' ')
							) {
								setValidURL(false)
							} else {
								setValidURL(true)
							}
							setNewPicture(e.target.value)
						}}
						className="form-control"
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						disabled={!validURL}
						onClick={() => {
							addPicture(newPicture)
							setShow(false)
						}}
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
