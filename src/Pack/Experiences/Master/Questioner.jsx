import React, { useState } from 'react'

import { shallow } from 'zustand/shallow'
import { useIntervals } from './stores/intervals'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Question from './Question'

export default function Questioner() {
	const [index, setIndex] = useState(0)
	const [questionIndex, setQuestionIndex] = useState(0)
	const [intervals, boxes, advanceCard] = useIntervals(
		(state) => [state.intervals, state.boxes, state.advanceCard],
		shallow
	)
console.log(boxes)
	const currentInterval = intervals[index]
	const content = boxes[currentInterval.box]
	const current = content[questionIndex]

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
						// TODO: very importnant, add limit
						next={() => setQuestionIndex(questionIndex + 1)}
						correct={() => advanceCard(currentInterval.box, questionIndex)}
					/>
				</Col>
			</Row>
		</>
	)
}
