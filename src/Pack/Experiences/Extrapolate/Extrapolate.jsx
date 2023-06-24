import React, { useState, useEffect, useRef } from 'react'

import { shallow } from 'zustand/shallow'
import { usePack } from '@/stores/pack'
import { Experience } from '../Experience'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import nlp from 'compromise'

import { v4 as uuidv4 } from 'uuid'
import { capitalizeFirstLetter } from '@/lib/utilities'

import { useParams } from 'react-router-dom'
import { useUser } from '@/stores/user'

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

	const { packId } = useParams()

	const [category, setCategory] = useState('Default')
	const [text, setText] = useState('')
	const [cards, setCards] = useState([])

	function generateCards() {
		// Create a new category if it doesn't exist
		var uuid = 'default'
		if (category.toLowerCase() !== 'default') {
			uuid = uuidv4()
			addCategory(category, ['transparent', 'transparent'], uuid)
		}

		// Parse the sentence using Compromise.js
		const doc = nlp(text)

		// We can't call setTerms() directly,
		// because the state is updated after
		// we use the spread operator the second time
		let t = []

		// Solutions identified by ChatGPT are considerably longer,
		// and aren't robust enough.
		doc.sentences()
			.json()
			.forEach((sentence) => {
				// Get the verb phrase in json form
				let vp = nlp(sentence.sentence.verb).verbs().json()[0]

				// Get the linking verb
				let lv = vp.verb.auxiliary

				// If there is only one verb,
				// confirm it is a linking verb (copula) and remove it
				if (vp.terms.length <= 1) {
					let isLv = vp.terms[0].tags.includes('Copula')
					if (isLv) vp = ''
				} else {
					// Remove the linking verb from the verb phrase
					vp = sentence.sentence.verb.replaceAll(lv, '').trim() + ' '
				}

				// By now, if the verb phrase isn't a string,
				// it probably contains no linking verbs,
				// so we can just use the original verb phrase
				if (typeof vp !== 'string') vp = sentence.sentence.verb + ' '

				// Get the subject in json form
				let np = nlp(sentence.sentence.subject).json()[0]

				// If the subject is a determiner
				// (e.g. this, that, these, those),
				// replace it with a textbox that autocompletes all previous terms
				let isDeterminer = np.terms[0].tags.includes('Determiner')
				if (isDeterminer) {
					np = 'Could not determine'
				} else {
					np = sentence.sentence.subject
				}

				// Minus whitespace and case,
				// if there is already a term with the same name,
				// append the text to it
				let existingTerm = t.findIndex(
					(term) =>
						term.term.toLowerCase().replace(' ', '') ==
						np.toLowerCase().replace(' ', '')
				)

				if (existingTerm !== -1) {
					t[existingTerm].definition +=
						'. ' + capitalizeFirstLetter(vp + sentence.sentence.predicate)
				} else {
					t.push({
						term: capitalizeFirstLetter(np),
						definition: capitalizeFirstLetter(vp + sentence.sentence.predicate),
						category: uuid,
						uuid: uuidv4(),
					})
				}
			})

		// Update the state
		setCards(t)

		// // Identify term candidates (nouns or noun phrases)
		// const termCandidates = doc.nouns().out('array')

		// // Identify definition candidates
		// const definitionCandidates = doc.match('#Noun * #Noun').not('#Noun').out('array')

		// console.log(definitionCandidates)

		// // Pair term and definition candidates
		// const termDefinitionPairs = []
		// termCandidates.forEach((term) => {
		// 	const matchingDefinition = definitionCandidates.find((definition) =>
		// 		definition.terms().some((termCandidate) => termCandidate.normal === term.normal)
		// 	)
		// 	if (matchingDefinition) {
		// 		if (category.toLowerCase() !== 'default') {
		// 			let uuid = uuidv4()
		// 			addCategory(category, ['transparent', 'transparent'], uuid)
		// 		}
		// 		termDefinitionPairs.push({
		// 			term: term.text(),
		// 			definition: matchingDefinition.text(),
		// 			category: category,
		// 			uuid: uuidv4(),
		// 		})
		// 	}
		// })

		// // Output the term and definition pairs
		// console.log(termDefinitionPairs)
		// setTerms(termDefinitionPairs)
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
			<div className="text-center">
				<h1>Extrapolate</h1>
				<p className="mb-3">
					Enter text or attach an image to automatically generate cards through AI
				</p>

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

				<Button
					variant="dark"
					size="lg"
					onClick={() => generateCards()}
					className="mt-3 mb-3"
				>
					🏭 Generate
				</Button>
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

					<div className="text-center">
						<Button variant="light" size="lg" onClick={saveCards}>
							➕ Add to pack
						</Button>
					</div>
				</>
			)}
		</>
	)
}

export function Extrapolate() {
	return (
		<Experience name="extrapolate">
			<ExtrapolateComponent />
		</Experience>
	)
}
