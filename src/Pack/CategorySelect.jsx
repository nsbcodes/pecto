import React, { useState, useContext } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { hslToHex } from '@/lib/utilities'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import { CardsContext } from '@/lib/context.js'

export function CategorySelect() {
	const cards = useContext(CardsContext)
	const [pack, addCategory, editCategory, setCardCategory, removeCardCategory] = usePack(
		(state) => [
			// Data
			state.pack,
			state.addCategory,
			state.editCategory,
			state.setCardCategory,
			state.removeCardCategory,
		],
		shallow
	)

	// New Category modal
	const [show, setShow] = useState(false)
	const [newCategory, setNewCategory] = useState('')
	const [newColor, setNewColor] = useState(['', ''])
	const [replaceCategory, setReplaceCategory] = useState('')

	const [editingCategoryDropdown, editCategoryDropdown] = useState(false)

	function submitNewCategory() {
		if (replaceCategory == '') {
			addCategory(newCategory, newColor)
		} else {
			editCategory(replaceCategory, { name: newCategory, colors: newColor })
			setNewCategory('New Category')
			setNewColor(['#FFFFFF', '#FFFFFF'])
			setReplaceCategory('')
		}
		setShow(false)
	}

	function changeCardCategory(category) {
		setCardCategory(cards.id, category)
	}

	function generateNewColor(currentHexCode) {
		var hue = currentHexCode
		if (currentHexCode == null) {
			hue = Math.floor(Math.random() * 360)
			console.log([hslToHex(hue, 100, 97), hslToHex(hue, 100, 99)])
			setNewColor([hslToHex(hue, 100, 97), hslToHex(hue, 100, 99)])
		} else {
			setNewColor([hue, hue])
		}
	}

	function showEditModal(id, category) {
		setNewCategory(category.name)
		setNewColor(category.colors)
		setReplaceCategory(id)
		setShow(true)
	}

	return (
		<>
			<DropdownButton
				title={pack.categories[cards.category].name}
				size="sm"
				className="ms-2"
				variant="outline-dark rounded-5"
			>
				{Object.entries(pack.categories).map(([id, category]) => (
					<div key={id}>
						<Dropdown.Item onClick={() => changeCardCategory(id)} key={category.name}>
							{category.name}
						</Dropdown.Item>

						{editingCategoryDropdown && (
							<div className="d-flex justify-content-between align-items-center ps-2 pe-2 pt-1 pb-1">
								<Button
									size="sm"
									variant="outline-light"
									onClick={() => showEditModal(id, category)}
								>
									✏️
								</Button>
								<Button
									size="sm"
									variant="outline-light"
									onClick={() => removeCardCategory(id)}
								>
									🗑️
								</Button>
							</div>
						)}
					</div>
				))}
				<li>
					<hr className="dropdown-divider" />
				</li>
				<div className="text-center d-flex justify-content-between align-items-center ps-2 pe-2">
					<Button
						size="sm"
						variant="light"
						onClick={() => editCategoryDropdown(!editingCategoryDropdown)}
					>
						⚒️
					</Button>
				</div>
				<li>
					<hr className="dropdown-divider" />
				</li>
				<Dropdown.Item
					className="text-center"
					onClick={() => {
						generateNewColor()
						setShow(true)
					}}
				>
					New
				</Dropdown.Item>
			</DropdownButton>

			{/* New Category Modal */}
			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Categories</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input
						type="text"
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
						className="form-control"
					/>
					<div className="mt-3 d-flex justify-content-between">
						<input
							type="color"
							className="form-control form-control-color"
							value={newColor[0]}
							onChange={(e) => generateNewColor(e.target.value)}
						/>
						<Button variant="dark" onClick={() => generateNewColor(null)}>
							Randomize
						</Button>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitNewCategory}>
						{/* eslint-disable-next-line prettier/prettier */}
						{(replaceCategory == '') ? 'Add New Category' : 'Set Category'}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
