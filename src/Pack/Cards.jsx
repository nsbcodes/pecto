import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import StaticPair from './Pair/StaticPair'
import EditingPair from './Pair/EditingPair'
import { CategorySelect } from './CategorySelect'
import { CardsContext } from '@/lib/context.js'

import Button from 'react-bootstrap/Button'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import { motion } from 'framer-motion'

function Cards(props) {
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

	useEffect(() => {
		setEditing(props.editing)
	}, [props.editing])

	const [editing, setEditing] = useState(props.editing)

	if (pack?.content == undefined) {
		return <div>Loading...</div>
	}

	function deletePair() {
		// let p = [...pack.content]
		// p.splice(cards.id, 1)
		// console.log(cards.id, p)
		deleteCard(cards.id)
		// console.log(pack.content)
	}

	return (
		<motion.div
			key={cards.id}
			className="p-3"
			style={{
				backgroundImage: `linear-gradient(to right, ${
					pack.categories[cards.category]['colors'][0]
				},${pack.categories[cards.category]['colors'][1]})`,
			}}
			initial={{ x: -100 }}
			animate={{ x: 0 }}
			exit={{ scale: 0 }}
		>
			<div className="d-flex justify-content-between align-items-center">
				{canEdit ? (
					<CategorySelect />
				) : (
					<div className="badge bg-primary ms-2">{cards.category}</div>
				)}
				<span className="text-muted me-4">{cards.id + 1}</span>
			</div>

			{canEdit && editing ? <EditingPair setEditing={setEditing} /> : <StaticPair />}

			{/* Edit/Remove buttons underneath the cards */}
			{canEdit && (
				<div className="d-flex justify-content-between">
					{!props.editing && (
						<Button
							className="text-muted text-decoration-none"
							variant="link"
							size="sm"
							onClick={() => setEditing(!editing)}
						>
							{editing ? 'Save' : 'Edit'}
						</Button>
					)}
					{/* eslint-disable-next-line prettier/prettier */}
					{pack.content.length > 1 && (
						<Button
							className="text-muted text-decoration-none"
							variant="link"
							size="sm"
							onClick={deletePair}
							tabIndex="-1"
						>
							Remove
						</Button>
					)}
				</div>
			)}
		</motion.div>
	)
}

export default Cards
