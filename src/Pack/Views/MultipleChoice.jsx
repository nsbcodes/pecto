import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { motion } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import './FlashcardView.scss'

function MultipleChoice(props) {
	const [similarTerms, setSimilarTerms] = useState([])
	const [pack, getSimilarCards] = usePack((state) => [state.pack, state.getSimilarCards], shallow)

	const [wrongAnswerClicked, clickedWrongAnswer] = useState(false)

	function regenerateSimilarTerms() {
		setSimilarTerms(getSimilarCards(pack.content[props.currentCard]))
	}

	useEffect(() => {
		// Go to the term on the next card if not in multiple choice mode
		regenerateSimilarTerms()
		clickedWrongAnswer(false)
	}, [props.currentCard])

	useEffect(() => {
		async function nextTermDelayed() {
			await new Promise((r) => setTimeout(r, 2000))
			props.setCurrentCard(props.currentCard + 1)
		}
		if (wrongAnswerClicked == true) nextTermDelayed()
	}, [wrongAnswerClicked])

	const choices = similarTerms.map((card, i) => (
		<div className="col py-3" key={card.term}>
			<div className="d-grid gap-2 col-10">
				<Button
					variant="light"
					onClick={() => {
						if (card !== pack.content[props.currentCard]) {
							clickedWrongAnswer(true)
						} else {
							props.setCurrentCard(props.currentCard + 1)
						}
					}}
					className="d-flex justify-content-between"
				>
					{card === pack.content[props.currentCard] && wrongAnswerClicked ? (
						<><div className="badge bg-success">✓</div> {card.term}</>
					) : (
						<><div className="badge bg-dark">{i + 1}</div> {card.term}</>
					)}
				</Button>
			</div>
		</div>
	))

	return (
		<motion.div
			initial={{
				y: 25,
			}}
			animate={{
				y: 0,
			}}
			className="rounded-3 mx-auto text-center mt-4"
		>
			<div className="container text-center">
				<div className="row row-cols-2 gx-3">{choices}</div>
			</div>
		</motion.div>
	)
}

export default MultipleChoice
