import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { motion } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import './FlashcardView.scss'

import MultipleChoice from './MultipleChoice'

function FlashcardView() {
	const [pack] = usePack((state) => [state.pack], shallow)
	const [currentCard, setCurrentCard] = useState(0)

	// Term/Definition switch click
	const [clicked, setClicked] = useState(false)

	// Options
	const [mcqMode, setMcqMode] = useState(false)

	return (
		<div className="container bg-dark text-light rounded-3 py-4 shadow-lg mt-3">
			<div className="container">
				{/* Mode Options */}
				<Form.Check
					className="mb-4"
					type="switch"
					label="Multiple Choice Mode"
					checked={mcqMode}
					onChange={(e) => {
						if (pack.content.length >= 4) {
							setMcqMode(e.target.checked)
						} else {
							alert('Add at least 4 cards to enable Multiple Choice mode')
						}
						if (e.target.checked == true) setClicked(true)
					}}
				/>

				{/* Flashcard */}
				<div
					key={pack.content[currentCard][clicked ? 'definition' : 'term']}
					className="shadow rounded-3 bg-secondary mx-auto text-center flashCard"
					onClick={() => {
						if (!mcqMode) setClicked(!clicked)
					}}
				>
					<p className="fcText">
						{pack.content[currentCard][clicked ? 'definition' : 'term']}
					</p>
				</div>

				{/* Multiple Choice */}
				{mcqMode && (
					<MultipleChoice currentCard={currentCard} setCurrentCard={setCurrentCard} />
				)}

				{/* Messy controls */}
				<div className="d-flex justify-content-evenly mt-5" key={currentCard}>
					{currentCard - 1 < 0 ? (
						<Button variant="light" disabled>
							Previous
						</Button>
					) : (
						<Button variant="light" onClick={() => setCurrentCard(currentCard - 1)}>
							Previous
						</Button>
					)}

					{/* Current Card */}
					<span className="align-middle">
						{currentCard + 1}/{pack.content.length}
					</span>

					{currentCard + 2 > pack.content.length ? (
						<Button variant="light" disabled>
							Next
						</Button>
					) : (
						<Button variant="light" onClick={() => setCurrentCard(currentCard + 1)}>
							Next
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

export default FlashcardView
