import React, { useState } from 'react'

import { shallow } from 'zustand/shallow'
import { useIntervals } from './stores/intervals'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Question from './Question'

export default function Questioner() {
	const [index, setIndex] = useState(1)
	const [subIndex, setSubIndex] = useState(0)
	const [lastTerm, setLastTerm] = useState(false)
	const [questionIndex, setQuestionIndex] = useState(0)
	const [intervals, advanceCard] = useIntervals(
		(state) => [state.intervals.intervals, state.advanceCard],
		shallow
	)

	function next() {
		setQuestionIndex(0)
		if (index + 1 > Object.keys(intervals).length && subIndex == intervals[index].length - 2) {
			setLastTerm(true)
			setSubIndex(subIndex + 1)
		} else if (subIndex < intervals[index].length - 1) {
			setSubIndex(subIndex + 1)
		} else {
			setSubIndex(0)
			setIndex(index + 1)
		}
	}

	function nextQuestion() {
		if (questionIndex + 1 >= intervals[index][subIndex].content[questionIndex].length) {
			next()
		} else {
			setQuestionIndex(questionIndex + 1)
		}
	}

	// Shorthand
	const stage = intervals[index][subIndex]

	return (
		<>
			<Row>
				<Col>
					<div>Stage {index}</div>
					<div>Box {stage.box + 1}</div>
					{/* {!lastTerm && <Button onClick={next}>Next</Button>} */}
				</Col>
				<Col xs={11}>
					<Question
						key={stage.content[questionIndex].uuid}
						card={stage.content[questionIndex]}
						next={nextQuestion}
						correct={() =>
							advanceCard(
								stage.content[questionIndex],
								index,
								subIndex,
								stage.box + 1
							)
						}
					/>
				</Col>
			</Row>
		</>
	)
}
