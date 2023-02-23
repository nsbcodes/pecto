import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { motion } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import './FlashcardView.scss'

function Answer(props) {
	return (
		<div className="col py-3" key={props.answerText}>
			<div className="d-grid gap-2 col-10">
				<Button
					variant="light"
					onClick={() => {
						handleAnswerClick(props.correctChoice)
					}}
					className="d-flex justify-content-between"
				>
					{props.correctChoice && props.wrongAnswerClicked ? (
						<><div className="badge bg-success">✓</div> {props.answerText}</>
					) : (
						<><div className="badge bg-dark">{props.i + 1}</div> {props.answerText}</>
					)}
				</Button>
			</div>
		</div>
	)
}

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

	async function nextTermDelayed() {
		await new Promise((r) => setTimeout(r, 1500))
		props.setCurrentCard(props.currentCard + 1)
	}

	async function handleAnswerClick(correctChoice) {
		if (!correctChoice) {
			clickedWrongAnswer(true)
		}
		nextTermDelayed()
	}

	const choices = similarTerms.map((card, i) => {
		const correctChoice = card == pack.content[props.currentCard]

		return (
			// <div className="col py-3" key={card.term}>
			// 	<div className="d-grid gap-2 col-10">
			// 		<Button
			// 			variant="light"
			// 			onClick={() => {
			// 				if (correctChoice) {
			// 					props.setCurrentCard(props.currentCard + 1)
			// 				} else {
			// 					clickedWrongAnswer(true)
			// 				}
			// 			}}
			// 			className="d-flex justify-content-between"
			// 		>
			// 			{correctChoice && wrongAnswerClicked ? (
			// 				<><div className="badge bg-success">✓</div> {card.term}</>
			// 			) : (
			// 				<><div className="badge bg-dark">{i + 1}</div> {card.term}</>
			// 			)}
			// 		</Button>
			// 	</div>
			// </div>
			<Answer key={card} i={i} correctChoice={correctChoice} answerText={card.term} wrongAnswerClicked={wrongAnswerClicked} handleAnswerClick={handleAnswerClick}/>
		)
	})

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