import React, { useEffect, memo } from 'react'
import { useState } from 'react'
import StaticPair from './Pair/StaticPair'
import EditingPair from './Pair/EditingPair'
import CategorySelect from './CategorySelect'
import PictureSelect from './PictureSelect'

import Button from 'react-bootstrap/Button'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import { motion } from 'framer-motion'

function MotionWrapper({ yes, index, style, children }) {
	if (yes) {
		return (
			<motion.div
				key={index}
				className="p-3"
				style={style}
				initial={{ x: -100 }}
				animate={{ x: 0 }}
				exit={{ scale: 0 }}
			>
				{children}
			</motion.div>
		)
	} else {
		return children
	}
}

/**
 * Rendered for each element in `pack.content`
 *
 * Creates either a `StaticPair` or `EditingPair` depending on the `edit` prop
 *
 * If `edit` is false, it includes an edit button that locally overrides the `edit` prop
 *
 * @component
 * @param {number} index - The index of the card in the pack
 * @param {boolean} edit - Whether or not the card is being edited
 */
function Cards({ index, edit }) {
	const [cards, previousCard, categories, packLength, deleteCard, canEdit] = usePack(
		(state) => [
			// Data
			state.pack.content[index],
			state.pack.content[index - 1],
			state.pack.categories,
			state.pack.content.length,
			state.deleteCard,
			// Editing
			state.canEdit,
		],
		shallow
	)

	const [editing, setEditing] = useState(edit)

	useEffect(() => {
		setEditing(edit)
	}, [edit])

	function deletePair() {
		// let p = [...pack.content]
		// p.splice(index, 1)
		deleteCard(index)
	}

	if (cards === undefined) {
		// If the card is undefined, this is probably the first card being deleted
		return <></>
	}

	var extra = ''
	var cardCSS = {}
	if (index !== 0 && cards?.picture !== undefined) {
		if (previousCard?.picture !== cards?.picture && cards.picture !== undefined) {
			extra = <img className="w-100" src={cards.picture}></img>
			cardCSS = {
				boxShadow: '-2px 0 0 #D7DDFC',
			}
		} else if (previousCard?.picture === cards?.picture) {
			cardCSS = {
				boxShadow: '-2px 0 0 #DEE2E6',
			}
		}
	} else if (cards?.picture !== undefined) {
		// max-width: 100px;
		// width: 100%;
		// height: auto;
		extra = <img className="w-100" src={cards.picture}></img>
		cardCSS = {
			boxShadow: '-2px 0 0 #DEE2E6',
		}
	}

	return (
		<MotionWrapper
			yes={!edit}
			index={index}
			style={{
				backgroundImage: `linear-gradient(to right, ${
					categories[cards.category]['colors'][0]
				},${categories[cards.category]['colors'][1]})`,
				...cardCSS,
			}}
		>
			<>{extra}</>
			<div className="d-flex justify-content-between align-items-center mt-5">
				{canEdit ? (
					<CategorySelect index={index} />
				) : (
					<div className="badge bg-primary ms-2">
						{categories[cards.category]['name']}
					</div>
				)}
				<div className="d-flex align-items-center">
					<PictureSelect index={index} />
					<span className="text-muted ms-3 me-4">{index + 1}</span>
				</div>
			</div>

			{canEdit && editing ? <EditingPair index={index} /> : <StaticPair index={index} />}

			{/* Edit/Remove buttons underneath the cards */}
			{canEdit && (
				<div className="d-flex justify-content-between">
					{!edit && (
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
					{packLength > 1 && (
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
		</MotionWrapper>
	)
}

// Memo is necessary to prevent the re-rendering of all cards when one is edited
export default memo(Cards)
