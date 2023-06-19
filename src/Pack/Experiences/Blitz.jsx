import React, { useEffect, useState } from 'react'

import { toTitleCase } from '@/lib/utilities'
import leven from 'leven'

import { useParams } from 'react-router-dom'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

function Blitz() {
	const { displayName, packId } = useParams()

	// No need to be specfic with selectors here,
	// since we aren't editing the pack
	const [pack, error, loading, loadPack, filterPackCategory] = usePack(
		(state) => [
			state.pack,
			state.error,
			state.loading,
			state.loadPack,
			state.filterPackCategory,
		],
		shallow
	)

	// Category filter
	const [categoryFilter, setCategoryFilter] = useState(0)

	// Guided/Unguided mode
	const [guided, setGuided] = useState(true)

	const [index, setIndex] = useState(0)
	const [answer, setAnswer] = useState('')
	const [feedback, setFeedback] = useState('')
	const [feedbackVariant, setFeedbackVariant] = useState('none')

	const [responses, setResponses] = useState({})

	useEffect(() => {
		loadPack(displayName, packId)
	}, [])

	useEffect(() => {
		if (pack?.content === undefined) return
		if (
			['?', 'how', 'what', 'where', 'why'].some((v) =>
				pack?.content[index].term.toLowerCase().includes(v)
			)
		) {
			// Go to the next term (if possible)
			if (index + 1 < pack.content.length) {
				setIndex(index + 1)
			} else {
				setFeedbackVariant('danger')
				setFeedback(<div>You have reached the end of the pack</div>)
			}
		} else {
			var resetLastTen = 0

			if (index % 10 == 0 && index != 0) {
				Object.values(responses).forEach((value) => {
					if (!value) {
						console.log('false')
						resetLastTen += 1
					}
				})

				if (resetLastTen > 0) {
					;(async () => {
						setFeedbackVariant('warning')
						setFeedback(
							<div>
								You got {resetLastTen} of the last 10 questions wrong!
								<br />
								<br />
								Rewinding to Term {index - 10}
							</div>
						)
						setTimeout(() => {
							setIndex(index - 10)
							setFeedbackVariant('none')
							setFeedback('')
						}, '5000')
					})()
				}
			}
		}
	}, [index, pack])

	// The === is very important, since it must be a boolean, not an error object
	if (error === true) {
		return (
			<div className="text-center">
				<h1>404</h1>
				<p>Sorry, this pack doesn&apos;t exist.</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="text-center">
				<h1>403</h1>
				<p>This pack exists, but hasn&apos;t been published.</p>
				<code>{error.toString()}</code>
			</div>
		)
	}

	// Loading logic
	// Also wait for the pack to load
	if (loading) {
		return (
			<div className="text-center">
				<h1>📎</h1>
				<Spinner animation="grow" size="sm" />
			</div>
		)
	}

	// If the filtered content is empty
	if (pack.content.length === 0) {
		return (
			<div className="container">
				<Form.Select
					className="w-25"
					onChange={(e) => {
						filterPackCategory(categoryFilter)
						setCategoryFilter(e.target.value)
					}}
					value={categoryFilter}
				>
					<option value="0">All</option>
					{Object.entries(pack.categories).map(([uuid, content]) => (
						<option
							key={uuid}
							value={uuid}
							style={{ backgroundColor: content.colors[1] }}
						>
							{content.name}
						</option>
					))}
				</Form.Select>

				<Form.Check
					type="switch"
					label="Guided Mode"
					className="mt-2"
					checked={guided}
					onChange={(e) => {
						if (
							e.target.checked == false &&
							confirm(
								'Disabling Guided Mode will erase your progress.\n\nAre you sure you want to continue?'
							)
						) {
							setResponses({})
							setGuided(false)
						} else {
							setResponses({})
							setGuided(true)
							setIndex(0)
						}
					}}
				/>
			</div>
		)
	}

	return (
		<div className="container">
			<Form.Select
				className="w-25"
				onChange={(e) => {
					filterPackCategory(categoryFilter)
					setCategoryFilter(e.target.value)
				}}
				value={categoryFilter}
			>
				<option value="0">All</option>
				{Object.entries(pack.categories).map(([uuid, content]) => (
					<option key={uuid} value={uuid} style={{ backgroundColor: content.colors[1] }}>
						{content.name}
					</option>
				))}
			</Form.Select>

			<Form.Check
				type="switch"
				label="Guided Mode"
				className="mt-2"
				checked={guided}
				onChange={(e) => {
					if (
						e.target.checked == false &&
						confirm(
							'Disabling Guided Mode will erase your progress.\n\nAre you sure you want to continue?'
						)
					) {
						setResponses({})
						setGuided(false)
					} else {
						setResponses({})
						setGuided(true)
						setIndex(0)
					}
				}}
			/>

			{!guided ? (
				<InputGroup className="w-25 mt-2">
					<Button
						variant="light"
						onClick={() => {
							if (index - 1 >= 0) setIndex(index - 1)
						}}
					>
						⬅️
					</Button>
					<Button disabled variant="light">
						{index + 1}
					</Button>
					<Button
						variant="light"
						onClick={() => {
							if (index + 1 < pack.content.length) setIndex(index + 1)
						}}
					>
						➡️
					</Button>
				</InputGroup>
			) : (
				<Button disabled variant="light" className="w-25">
					{index + 1}
				</Button>
			)}

			<div className="d-flex justify-content-center mt-5">
				<div>
					<h3 className="w-75 mt-5 mx-auto">{pack.content[index].definition}</h3>

					{feedbackVariant != 'none' && (
						<Alert className="w-50 mx-auto" variant={feedbackVariant}>
							{feedback}
						</Alert>
					)}

					<input
						className="w-50 mx-auto mt-3 form-control form-control-lg"
						type="text"
						placeholder="Answer"
						value={answer}
						disabled={feedbackVariant != 'none'}
						onChange={(e) => {
							setAnswer(toTitleCase(e.target.value))
						}}
						// autoFocus only focuses on the initial render
						ref={(input) => input && input.focus()}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								let correctAnswer = toTitleCase(pack.content[index].term)
								let correctness = leven(answer, correctAnswer)
								if (correctness == 0) {
									setResponses({ ...responses, [index]: true })
									setFeedbackVariant('success')
									setFeedback('✔️ Correct')
								} else if (correctness <= 3) {
									setResponses({ ...responses, [index]: true })
									setFeedbackVariant('info')
									setFeedback(
										<span>
											✔️ Correct
											<br />
											<span className="text-muted">
												You put &quot;{answer}&quot;, which is close enough
												to &quot;{correctAnswer}&quot;
											</span>
										</span>
									)
								} else {
									setResponses({ ...responses, [index]: false })
									setFeedbackVariant('danger')
									setFeedback(
										<span>
											❌ Incorrect
											<br />
											<span className="text-muted">
												The correct answer is &quot;{correctAnswer}&quot;
											</span>
										</span>
									)
								}

								setTimeout(() => {
									setFeedbackVariant('none')
									setFeedback('')
									setAnswer('')
									if (index + 1 < pack.content.length) setIndex(index + 1)
								}, '2000')
							}
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default Blitz
