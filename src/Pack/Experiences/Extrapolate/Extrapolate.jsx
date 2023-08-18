import React, { useState, useEffect, useRef, useContext } from 'react'

import { shallow } from 'zustand/shallow'
import { usePack } from '@/stores/pack'
import { Experience } from '../Experience'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Accordion from 'react-bootstrap/Accordion'

import { useParams } from 'react-router-dom'
import { useUser } from '@/stores/user'
import { ThemeContext } from '@/lib/context'

import { generateCards } from './NLP'
import LLMPipeline from './LLMPipeline'

function InputWrapper({ value, save }) {
	const ref = useRef(null)

	useEffect(() => {
		resize()
	}, [])

	// Automatically resizes textareas
	function resize() {
		ref.current.style.height = 'inherit'
		ref.current.style.height = `${ref.current.scrollHeight + 2}px`
	}

	return (
		<Form.Control
			type="text"
			value={value}
			as="textarea"
			ref={ref}
			onChange={(e) => {
				save(e)
				resize()
			}}
		/>
	)
}

function ExtrapolateComponent() {
	const [newPack] = useUser((state) => [state.newPack], shallow)
	const [pack, addCategory] = usePack((state) => [state.pack, state.addCategory], shallow)
	const theme = useContext(ThemeContext)

	const { packId } = useParams()

	const [category, setCategory] = useState('Default')
	const [text, setText] = useState('')
	const [cards, setCards] = useState([])

	async function generateTerm() {
		const condenser = await LLMPipeline.getInstance()
		console.log(await condenser(text))
	}

	async function saveCards() {
		setCards([])
		setText('')
		let p = { ...pack }
		// For whatever reason p.content.push(..cards)
		// gives us an "Object is not extensible" error
		p.content = p.content.concat(cards)
		await newPack(packId, p)
	}

	return (
		<>
			<div className="text-center mt-5">
				<h1>Extrapolate</h1>
				<p className="mb-3">Enter text to automatically generate cards through AI</p>

				<FloatingLabel label="Category">
					<Form.Control
						type="text"
						value={category}
						onChange={(e) => {
							setCategory(e.target.value)
						}}
						className="mb-3"
					/>
				</FloatingLabel>

				<FloatingLabel label="Excerpt">
					<InputWrapper value={text} save={(e) => setText(e.target.value)} />
				</FloatingLabel>

				<Accordion defaultActiveKey="0" flush className="mt-3">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Lightweight NLP</Accordion.Header>
						<Accordion.Body>
							<Button
								variant={theme.dark ? 'light' : 'dark'}
								size="lg"
								onClick={() => generateCards(text, category, addCategory, setCards)}
								className="mt-3 mb-3"
							>
								🏭 Generate
							</Button>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Optimized LLM</Accordion.Header>
						<Accordion.Body>
							<Button
								variant={theme.dark ? 'light' : 'dark'}
								size="lg"
								onClick={generateTerm}
								className="mt-3 mb-3"
							>
								⚒️ Generate
							</Button>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</div>

			{cards.length > 0 && (
				<>
					<Table striped bordered>
						<thead>
							<tr>
								<th>#</th>
								<th>Term</th>
								<th>Definition</th>
							</tr>
						</thead>
						<tbody>
							{cards.map((card, index) => {
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>
											<InputWrapper
												value={card.term}
												save={(e) => {
													let t = [...cards]
													t[index].term = e.target.value
													setCards(t)
												}}
											/>
										</td>
										<td>
											<InputWrapper
												value={card.definition}
												save={(e) => {
													let t = [...cards]
													t[index].definition = e.target.value
													setCards(t)
												}}
											/>
										</td>
									</tr>
								)
							})}
						</tbody>
					</Table>

					<div className="text-center mb-5">
						<Button variant={theme.color} size="lg" onClick={saveCards}>
							➕ Add to pack
						</Button>
					</div>
				</>
			)}
		</>
	)
}

const Extrapolate = function () {
	return (
		<Experience name="extrapolate" showFilter={false}>
			<ExtrapolateComponent />
		</Experience>
	)
}

export default Extrapolate
