import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import { CardsContext } from '@/lib/context'
import { Metadata } from './Metadata'
import { useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'

import FlashcardView from './Views/FlashcardView'

import './Pack.scss'

import { usePack } from '@/stores/pack'
import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

import { v4 as uuidv4 } from 'uuid'
import { AnimatePresence, motion } from 'framer-motion'

function Pack() {
	const { displayName, packId } = useParams()
	// We wrap useState around this so we can modify it (ex. adding new cards)
	//const { pack: ogPack, mutate, isLoading, error } = usePack(packId)
	//const { pack, setPack } = useState(ogPack)
	const [user, newPack] = useUser((state) => [state.user, state.newPack], shallow)
	const [pack, error, loading, loadPack, addCards, canEdit, letMeEdit] = usePack(
		(state) => [
			// Data
			state.pack,
			state.error,
			state.loading,
			state.loadPack,
			state.addCards,
			// Editing
			state.canEdit,
			state.letMeEdit,
		],
		shallow
	)

	// For a saving progress spinner
	const [saving, startSaving] = useState(false)

	useEffect(() => {
		loadPack(displayName, packId)
	}, [])

	useEffect(() => {
		if ((pack !== undefined && user?.uid == pack.uid) || pack?.uid == 'me') {
			console.log('is true, babbu', user?.uid, pack?.uid)
			letMeEdit(true)
		}
	}, [user, pack])

	// Loading logic
	if (loading || pack?.uuid != packId) {
		return (
			<div className="text-center">
				<h1>📎</h1>
				<Spinner animation="grow" size="sm" />
			</div>
		)
	}

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

	async function newCards() {
		// Add new terms
		addCards({
			term: '',
			definition: '',
			category: 'default',
			uuid: uuidv4(),
		})
	}

	async function saveCards() {
		startSaving(true)

		await newPack(packId, pack)

		// This isn't a stopgap for async, it just shows the saving spinner,
		// providing feedback to the user
		setTimeout(() => {
			startSaving(false)
		}, '200')
	}

	return (
		<div id="packRoot" className="mx-auto border border-2 p-4 rounded-3">
			<Metadata />

			<FlashcardView />

			<motion.div id="packContentContainer" className="mt-3 border border-2 rounded-3">
				<AnimatePresence>
					{pack.content.map((cards, index) => (
						<CardsContext.Provider
							key={cards.uuid}
							value={{
								term: cards.term,
								definition: cards.definition,
								category: cards.category,
								uuid: cards.uuid,
								id: index,
							}}
						>
							<Cards />
						</CardsContext.Provider>
					))}
				</AnimatePresence>
			</motion.div>

			{canEdit && (
				<div id="parentToolbar" className="d-flex justify-content-between fixed-bottom">
					<ButtonGroup className="mx-auto fw-bold" id="bottomToolbar">
						<Button variant="light" onClick={newCards} className="p-3">
							➕ New
						</Button>
						{/* <Button
							variant="light"
							onClick={() => {
								setEditingAll(!editingAll)
							}}
							className="p-3"
						>
							{editingAll ? '✔️ Done' : '✏️ Edit All'}
						</Button> */}
						<Button variant="light" onClick={saveCards} className="p-3">
							{saving ? (
								<Spinner animation="border" variant="dark" size="sm" />
							) : (
								'💾 Save'
							)}
						</Button>
						<LinkContainer to={`/edit/${pack.author}/${pack.uuid}`}>
							<Button variant="light" onClick={saveCards} className="p-3">
								✏️ Edit
							</Button>
						</LinkContainer>
					</ButtonGroup>
				</div>
			)}
		</div>
	)
}

export default Pack
