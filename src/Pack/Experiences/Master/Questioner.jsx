import React, { useState } from 'react'

import { shallow } from 'zustand/shallow'
import { useIntervals } from './stores/intervals'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Question from './Question'

export default function Questioner() {
	const [intervals, boxes, advanceCard] = useIntervals(
		(state) => [state.intervals, state.boxes, state.advanceCard],
		shallow
	)

	const [index, setIndex] = useState(0)
	const [questionIndex, setQuestionIndex] = useState(0)
	const [done, setDone] = useState(false)

	const currentInterval = intervals[index]
	const content = boxes[currentInterval.box]
	const current = content[questionIndex]

	function next() {
		if (index + 1 >= intervals.length) {
			setDone(true)
		}
		if (questionIndex + 1 >= content.length) {
			setQuestionIndex(0)
			setIndex(index + 1)
		} else {
			setQuestionIndex(questionIndex + 1)
		}
	}

	return (
		<>
			<Row>
				<Col>
					<div>Stage {currentInterval.day}</div>
					<div>Box {currentInterval.box + 1}</div>
					{/* <div>Box {stage.box + 1}</div> */}
					{/* {!lastTerm && <Button onClick={next}>Next</Button>} */}
				</Col>
				<Col xs={11}>
					<Question
						key={current.uuid}
						card={current}
						next={next}
						correct={() => advanceCard(currentInterval.box, questionIndex)}
					/>
				</Col>
			</Row>
		</>
	)
}
