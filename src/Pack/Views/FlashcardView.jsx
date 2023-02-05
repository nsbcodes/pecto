import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'

import { motion } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import './FlashcardView.scss'

function FlashcardView() {
	const [pack] = usePack((state) => [state.pack], shallow)
	const [currentCard, setCurrentCard] = useState(0)

	// Term/Definition switch click
	const [clicked, setClicked] = useState(false)

	useEffect(() => {
		// Always go to the term on the next card
		setClicked(false)
	}, [currentCard])

	return (
		<motion.div
			animate={{ y: 0 }}
			initial={{ y: 50 }}
			className="container bg-dark text-light rounded-3 py-5 shadow-lg mt-3"
		>
			<div className="container">
				{clicked ? (
					<div style={{ position: 'relative' }}>
						<motion.div
							initial={{ y: 0 }}
							animate={{ y: -10 }}
							key={pack.content[currentCard]['definition']}
							className="shadow rounded-3 bg-secondary mx-auto text-center flashCard"
							onClick={() => setClicked(!clicked)}
						>
							<h3>{pack.content[currentCard]['definition']}</h3>
						</motion.div>
					</div>
				) : (
					<motion.div
						initial={{ y: -10, x: 25 }}
						animate={{ y: 0, x: 0 }}
						key={pack.content[currentCard]['term']}
						className="shadow rounded-3 bg-secondary mx-auto text-center flashCard"
						onClick={() => setClicked(!clicked)}
					>
						<h3>{pack.content[currentCard]['term']}</h3>
					</motion.div>
				)}

				<motion.div
					initial={{ x: 25 }}
					animate={{ x: 0 }}
					className="d-flex justify-content-evenly mt-5"
					key={currentCard}
				>
					{currentCard - 1 < 0 ? (
						<Button variant="light" disabled>
							Previous
						</Button>
					) : (
						<Button variant="light" onClick={() => setCurrentCard(currentCard - 1)}>
							Previous
						</Button>
					)}

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
				</motion.div>
			</div>
		</motion.div>
	)
}

export default FlashcardView
