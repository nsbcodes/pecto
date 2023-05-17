import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import StaticPair from './Pair/StaticPair'
import EditingPair from './Pair/EditingPair'
import { CategorySelect } from './CategorySelect'
import { PictureSelect } from './PictureSelect'
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

	const [editing, setEditing] = useState(props.editing)

	useEffect(() => {
		setEditing(props.editing)
	}, [props.editing])

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

	var extra = ''
	if (cards.id !== 0) {
		if (pack.content[cards.id - 1].picture !== cards.picture && cards.picture !== undefined) {
			extra = <img className="w-100" src={cards.picture}></img>
		}
	} else if (cards.picture !== undefined) {
		// max-width: 100px;
		// width: 100%;
		// height: auto;
		extra = (
			<div>
				<img className="w-100" src={cards.picture}></img>
				cummers
			</div>
		)
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
			<>{extra}</>
			<div className="d-flex justify-content-between align-items-center mt-5">
				{canEdit ? (
					<CategorySelect />
				) : (
					<div className="badge bg-primary ms-2">{cards.category}</div>
				)}
				<div className="d-flex align-items-center">
					{/* <Form.Select
						size="sm"
						style={{ display: 'inline !important' }}
						className="me-3"
						value={pictureURL}
						onChange={(e) => {
							// Set the actual card's picture
							setCardPicture(cards.id, e.target.value)
							// Set the state
							setPictureURL(e.target.value)
						}}
					>
						<option value="">No picture</option>
					</Form.Select> */}
					<PictureSelect />
					<span className="text-muted ms-3 me-4">{cards.id + 1}</span>
				</div>
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
