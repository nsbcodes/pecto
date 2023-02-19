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
		<motion.div
			animate={{ y: 0 }}
			initial={{ y: 50 }}
			className="container bg-dark text-light rounded-3 py-4 shadow-lg mt-3"
		>
			<div className="container">
				{/* Mode Options */}
				<Form.Check
					className="mb-4"
					type="switch"
					label="Multiple Choice Mode"
					value={mcqMode}
					onChange={(e) => {
						setMcqMode(e.target.checked)
						if (e.target.checked == true) setClicked(true)
					}}
				/>

				{/* Flashcard */}
				<motion.div
					initial={{ y: -10, x: 25 }}
					animate={{ y: 0, x: 0 }}
					key={pack.content[currentCard][clicked ? 'definition' : 'term']}
					className="shadow rounded-3 bg-secondary mx-auto text-center flashCard"
					onClick={() => {
						if (!mcqMode) setClicked(!clicked)
					}}
				>
					<p className="fcText">
						{pack.content[currentCard][clicked ? 'definition' : 'term']}
					</p>
				</motion.div>

				{/* Multiple Choice */}
				{mcqMode && (
					<MultipleChoice currentCard={currentCard} setCurrentCard={setCurrentCard} />
				)}

				{/* Messy controls */}
				<motion.div
					initial={{ x: 25 }}
					animate={{ x: 0 }}
					className="d-flex justify-content-evenly mt-5"
					key={currentCard}
				>
					{/* TODO: fix code duplication */}
					{true &&
						(currentCard - 1 < 0 ? (
							<Button variant="light" disabled>
								Previous
							</Button>
						) : (
							<Button variant="light" onClick={() => setCurrentCard(currentCard - 1)}>
								Previous
							</Button>
						))}

					<span className="align-middle">
						{currentCard + 1}/{pack.content.length}
					</span>

					{true &&
						(currentCard + 2 > pack.content.length ? (
							<Button variant="light" disabled>
								Next
							</Button>
						) : (
							<Button variant="light" onClick={() => setCurrentCard(currentCard + 1)}>
								Next
							</Button>
						))}
				</motion.div>
			</div>
		</motion.div>
	)
}

export default FlashcardView
