import React, { useState, useMemo, useReducer } from 'react'

import { shallow } from 'zustand/shallow'
import { usePack } from '@/stores/pack'
import { Experience } from '../Experience'
import { Filter } from '../Filter'

import { shuffle } from '@/lib/utilities'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ProgressBar from 'react-bootstrap/ProgressBar'

import MultipleChoice from './Questions/MultipleChoice'
import TrueOrFalse from './Questions/TrueOrFalse'
import Written from './Questions/Written'

// We have to use a reducer since the next state depends on the previous state,
// and state updates are called at the same time (submit)

const initialState = { answers: {} }

function reducer(state, action) {
	let answers = { ...state.answers, [action.payload.i]: action.payload.val }
	let arr = Object.values(answers)
	let sum = arr.reduce((a, b) => a + b)
	let right = (sum / arr.length) * 100
	let wrong = ((arr.length - sum) / arr.length) * 100
	return {
		answers: answers,
		right: right,
		wrong: wrong,
		fraction: `${sum}/${arr.length}`,
		percentage: Math.round((sum / arr.length) * 100 * 100) / 100,
	}
}

export function Test({ questions }) {
	const [content] = usePack((state) => [state.pack.content], shallow)
	const [submit, setSubmit] = useState(false)
	const [answers, dispatch] = useReducer(reducer, initialState)

	// Only randomize the questions once
	const randomContent = useMemo(() => shuffle(content), [questions])
	const questionList = useMemo(
		() =>
			randomContent.slice(0, questions.total).map((card, i) => {
				// TODO: Fix repetition
				if (i < questions.mcq) {
					return (
						<MultipleChoice
							key={i}
							i={i}
							submit={submit}
							save={(val) => dispatch({ payload: { i: i, val: val } })}
						/>
					)
				} else if (i < questions.mcq + questions.written) {
					return (
						<Written
							key={i}
							i={i}
							submit={submit}
							save={(val) => dispatch({ payload: { i: i, val: val } })}
						/>
					)
				} else if (i < questions.mcq + questions.written + questions.tfq) {
					return (
						<TrueOrFalse
							key={i}
							i={i}
							submit={submit}
							save={(val) => dispatch({ payload: { i: i, val: val } })}
						/>
					)
				} else if (i < questions.mcq + questions.written + questions.tfq + questions.hmcq) {
					return (
						<MultipleChoice
							key={i}
							i={i}
							submit={submit}
							hard
							save={(val) => dispatch({ payload: { i: i, val: val } })}
						/>
					)
				}
			}),
		[submit, randomContent]
	)

	return (
		<>
			{questionList}
			{/* <div className="mx-auto w-75">
				<Button className="mb-3" variant="primary" size="lg">Submit</Button>
			</div> */}
			<Button
				className="mb-3 mx-auto d-block"
				variant="primary"
				size="lg"
				onClick={() => setSubmit(true)}
				disabled={submit}
			>
				Submit
			</Button>
			{submit && (
				<div className="text-center">
					<hr />
					{answers.percentage < 75 ? (
						<p>Use the Blitz or Master mode to guarantee memorization!</p>
					) : (
						<>
							<h1>🎉</h1>
							<h2>You got {answers.percentage} percent!</h2>
						</>
					)}
					<hr className="mb-3" />
					<h3>{answers.fraction}</h3>
					<ProgressBar className="mb-3">
						<ProgressBar
							striped
							animated
							variant="success"
							now={answers.right}
							key={1}
						/>
						<ProgressBar
							striped
							animated
							variant="danger"
							now={answers.wrong}
							key={2}
						/>
					</ProgressBar>
				</div>
			)}
		</>
	)
}
