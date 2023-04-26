import React from 'react'
import { useState } from 'react'
import { CardsContext } from '@/lib/context'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import Form from 'react-bootstrap/Form'

import { v4 as uuidv4 } from 'uuid'

function EditingPair() {
	const cards = React.useContext(CardsContext)
	const [pack, setCard, addCards] = usePack(
		(state) => [
			// Data
			state.pack,
			state.setCard,
			state.addCards,
		],
		shallow
	)
	const [term, setTerm] = useState(cards.term)
	const [definition, setDefinition] = useState(cards.definition)

	// async function exitEditingMode() {
	// 	// When the user clicks "Done" and the component will be switched to the static version,
	// 	// we commit our changes
	// 	console.log(cards.id, { term: term, definition: definition })
	// 	setCard(cards.id, { term: term, definition: definition })

	// 	// Self-destruct
	// 	// No other code below here
	// 	props.setEditing(false)
	// }

	return (
		// <div>
		//     <form>
		//         <label>
		//             Term
		//             <input
		//                 type="text"
		//                 value={term}
		//                 onChange={(e) => setTerm(e.target.value)}
		//             />
		//         </label>

		//         <label>
		//             Definition
		//             <input
		//                 type="text"
		//                 value={definition}
		//                 onChange={(e) => setDefinition(e.target.value)}
		//             />
		//         </label>
		//     </form>
		//     <button onClick={exitEditingMode}>
		//         Done
		//     </button>
		// </div>

		<Form>
			<div className="container overflow-hidden text-center">
				<div className="row">
					<div className="col p-2">
						<div className="p-2 py-2 shadow-sm bg-light rounded-3">
							<Form.Control
								className="bg-transparent"
								type="text"
								value={term}
								onChange={(e) => {
									setCard(cards.id, { term: e.target.value })
									setTerm(e.target.value)
								}}
							/>
						</div>
					</div>
					<div className="col p-2">
						<div className="p-2 py-2 shadow-sm bg-light rounded-3">
							<Form.Control
								className="bg-transparent"
								type="text"
								value={definition}
								onChange={(e) => {
									setCard(cards.id, { definition: e.target.value })
									setDefinition(e.target.value)
								}}
								onKeyDown={(e) => {
									if (
										e.keyCode === 9 &&
										// Make sure this is the last card
										cards.id === pack.content.length - 1 &&
										// No modifier keys
										!e.shiftKey &&
										!e.ctrlKey &&
										!e.altKey &&
										!e.metaKey
									) {
										// Tab
										//e.preventDefault()
										// Add a new card
										addCards({
											term: '',
											definition: '',
											category: 'default',
											uuid: uuidv4(),
										})
									}
								}}
								onKeyUp={(e) => {
									if (
										e.keyCode === 9 &&
										// Make sure this is the last card
										cards.id === pack.content.length - 1 &&
										// No modifier keys
										!e.shiftKey &&
										!e.ctrlKey &&
										!e.altKey &&
										!e.metaKey
									) {
										console.log('yes')
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* 
			<Button variant="success" size="sm" onClick={exitEditingMode}>
				Done
			</Button> */}
		</Form>
	)
}

export default EditingPair
