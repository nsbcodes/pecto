import React from 'react'
import { useState, useContext } from 'react'
import StaticPair from './Pair/StaticPair'
import EditingPair from './Pair/EditingPair'
import { CategorySelect } from './CategorySelect'
import { CardsContext } from '@/lib/context.js'

import Button from 'react-bootstrap/Button'

import { motion } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

function Cards() {
	const cards = useContext(CardsContext)
	const [pack, deleteCard, canEdit] = usePack(
		(state) => [
			// Data
			state.pack,
			state.deleteCard,
			// Editing
			state.canEdit,
		],
		shallow
	)

	if (pack?.content == undefined) {
		return <div>Loading...</div>
	}

	const [editing, setEditing] = useState(false)

	function deletePair() {
		deleteCard(cards.id)
	}

	if (editing && canEdit) {
		return <EditingPair setEditing={setEditing} />
	} else {
		console.log(pack.categories, cards.category)
		return (
			<motion.div
				key={cards.id}
				animate={{ x: 0 }}
				initial={{ x: 100 }}
				exit={{ x: -100, opacity: 0 }}
				className="p-3"
				style={{
					backgroundImage: `linear-gradient(to right, ${
						pack.categories[cards.category]['colors'][0]
					},${pack.categories[cards.category]['colors'][1]})`,
				}}
			>
				{canEdit ? (
					<CategorySelect />
				) : (
					<div className="badge bg-primary ms-2">{cards.category}</div>
				)}
				<StaticPair />
				{/* Edit/Remove buttons underneath the cards */}
				{canEdit ? (
					<div className="d-flex justify-content-between">
						<Button
							className="text-muted text-decoration-none"
							variant="link"
							size="sm"
							onClick={() => setEditing(!editing)}
						>
							Edit
						</Button>
						{/* eslint-disable-next-line prettier/prettier */}
						{pack.content.length > 1 && (
							<Button
								className="text-muted text-decoration-none"
								variant="link"
								size="sm"
								onClick={() => deletePair()}
							>
								Remove
							</Button>
						)}
					</div>
				) : null}
			</motion.div>
		)
	}
}

export default Cards
