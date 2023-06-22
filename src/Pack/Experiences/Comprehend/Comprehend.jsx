import React from 'react'

import { shallow } from 'zustand/shallow'
import { usePack } from '@/stores/pack'
import { Experience } from '../Experience'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { Markup } from '@/lib/Markup'

import nlp from 'compromise'

import { v4 as uuidv4 } from 'uuid'

function ComprehendComponent() {
	const [pack, length] = usePack((state) => [state.pack, state.pack.content.length], shallow)

	// Must be a single sentence
	function minifyDefinition(sentence, includeSubject = false) {
		// Strip HTML
		sentence = sentence.replace(/<[^>]*>?/gm, '')

		// Convert to present tense
		let doc = nlp(nlp(sentence).sentences().toPresentTense().text())

		var output = ''
		const and = uuidv4()

		// Get the parts of the sentence
		// let parts = doc.sentences().json()[0].sentence
		doc.sentences()
			.json()
			.forEach((e, i) => {
				if (e.sentence.predicate.length > 2 && e.sentence.verb.length > 2) {
					if (includeSubject) {
						output +=
							(i > 0 ? and : '') + e.sentence.subject + ' is ' + e.sentence.predicate
					} else {
						output += (i > 0 ? and : '') + e.sentence.verb + ' ' + e.sentence.predicate
					}
				}
			})

		// Remove the and placeholder if it is at the start or end of the string
		if (output.trim().startsWith(`${and} `)) output = output.substring(5)
		if (output.trim().endsWith(` ${and}`)) output = output.substring(0, output.length - 5)

		// Capitalize the first letter
		output = output.charAt(0).toUpperCase() + output.slice(1)
		output = output.replaceAll(and, ' and ')

		return output
	}

	return (
		<>
			<div className="text-center">
				<h1>Comprehend</h1>
				<p className="mb-3">
					Generate reports, mnemonics, and ___ using Artificial Intelligence and Natural
					Language Processing
				</p>
				<Button
					variant="dark"
					size="lg"
					className="mb-4"
					onClick={alert(
						'Not implemented yet!\n\nAll AI results should already be shown in the rightmost columns below.'
					)}
				>
					🏭 Generate
				</Button>
			</div>

			<Table striped bordered>
				<thead>
					<tr>
						<th>#</th>
						<th>Term</th>
						<th>Definition</th>
						<th>Summary</th>
					</tr>
				</thead>
				<tbody>
					{pack.content.map((card, index) => {
						return (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>
									<Markup content={card.term} />
								</td>
								<td>
									<Markup content={card.definition} />
								</td>
								<td>{minifyDefinition(card.definition)}</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</>
	)
}

export function Comprehend() {
	return (
		<Experience name="comprehend">
			<ComprehendComponent />
		</Experience>
	)
}
