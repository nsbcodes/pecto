import React, { useEffect, useState } from 'react'
import { fetcher } from '@/lib/pack'
import Cards from './Cards'
import { CardsContext } from '@/lib/context'
import { Metadata } from './Metadata'
import { useParams } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'

import FlashcardView from './Views/FlashcardView'

import './Pack.scss'

import { AnimatePresence } from 'framer-motion'

import { usePack } from '@/stores/pack'
import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

function Pack() {
	const { displayName, packId } = useParams()
	// We wrap useState around this so we can modify it (ex. adding new cards)
	//const { pack: ogPack, mutate, isLoading, error } = usePack(packId)
	//const { pack, setPack } = useState(ogPack)
	const [user, newPack] = useUser((state) => [state.user, state.newPack], shallow)
	const [pack, loadPack, addCards, canEdit, letMeEdit] = usePack(
		(state) => [
			// Data
			state.pack,
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
		async function fetchData() {
			loadPack(await fetcher(packId, displayName))
		}
		if (pack?.content === undefined) fetchData()
	}, [])

	useEffect(() => {
		if (user?.uid != '' || displayName == 'me') {
			letMeEdit(true)
		}
	}, [user])

	// if (error) return <div>Could not retrieve test.json - make dynamic</div>
	// if (isLoading) return <div>Loading</div>
	if (pack?.content === undefined) {
		return <div>Pack Not Found</div>
	}

	async function newCards() {
		// Add new terms
		addCards({
			term: '',
			definition: '',
			category: 'default',
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

			<div id="packContentContainer" className="mt-3 border border-2 rounded-3">
				<AnimatePresence>
					{pack.content.map((cards, index) => (
						<CardsContext.Provider
							key={index}
							value={{
								term: cards.term,
								definition: cards.definition,
								category: cards.category,
								id: index,
							}}
						>
							<Cards />
						</CardsContext.Provider>
					))}
				</AnimatePresence>
			</div>

			{canEdit && (
				<div id="parentToolbar" className="d-flex justify-content-between fixed-bottom">
					<ButtonGroup className="mx-auto fw-bold" id="bottomToolbar">
						<Button variant="light" onClick={newCards} className="p-3">
							➕ New
						</Button>
						<Button variant="light" onClick={saveCards} className="p-3">
							{saving ? (
								<Spinner animation="border" variant="dark" size="sm" />
							) : (
								'💾 Save'
							)}
						</Button>
					</ButtonGroup>
				</div>
			)}
		</div>
	)
}

export default Pack
