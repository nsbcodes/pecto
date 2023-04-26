import React, { useEffect, useState } from 'react'
import { fetcher } from '@/lib/pack'
import Cards from './Cards'
import { CardsContext } from '@/lib/context'
import { Metadata } from './Metadata'
import { useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'

import './Pack.scss'

import { usePack } from '@/stores/pack'
import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

import { AnimatePresence, motion } from 'framer-motion'

function EditPack() {
	const { displayName, packId } = useParams()
	// We wrap useState around this so we can modify it (ex. adding new cards)
	//const { pack: ogPack, mutate, isLoading, error } = usePack(packId)
	//const { pack, setPack } = useState(ogPack)
	const [user, newPack] = useUser((state) => [state.user, state.newPack], shallow)
	const [pack, error, setError, loadPack, letMeEdit] = usePack(
		(state) => [
			// Data
			state.pack,
			state.error,
			state.setError,
			state.loadPack,
			// Editing
			state.letMeEdit,
		],
		shallow
	)

	// For a saving progress spinner
	const [saving, startSaving] = useState(false)

	// const [editingAll, setEditingAll] = useState(false)

	useEffect(() => {
		async function fetchData() {
			const ref = await fetcher(packId, displayName)
			// Data exists in Dexie
			if (user?.uid === undefined && ref !== undefined) {
				loadPack(ref)
				setError(false)
				// Data exists in Firebase
			} else if (ref.exists()) {
				loadPack(ref.data())
				setError(false)
				// Data doesn't exist in Firebase or Dexie
			} else {
				loadPack(undefined)
				setError(true)
			}
		}
		if (pack?.content === undefined) fetchData()
	}, [])

	useEffect(() => {
		if (user?.uid !== pack.uid && pack.uid !== 'me') {
			return (
				<div className="text-center">
					<h1>403</h1>
					<p>You don&apos;t have permission to edit this pack.</p>
				</div>
			)
		} else {
			letMeEdit(true)
		}
	}, [user])

	// Loading logic
	if (error === undefined) {
		return (
			<div className="text-center">
				<h1>📎</h1>
				<Spinner animation="grow" size="sm" />
			</div>
		)
	} else if (error) {
		return (
			<div className="text-center">
				<h1>404</h1>
				<p>Sorry, this pack doesn&apos;t exist.</p>
			</div>
		)
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
		<div id="packRoot" className="mx-auto mb-5 border border-2 p-4 rounded-3">
			<Metadata editing />

			{/* <FlashcardView /> */}

			<motion.div
				id="packContentContainer"
				className="mt-3 border border-2 rounded-3"
				// style={{ height: 'fit-content' }}
				// layout
			>
				<AnimatePresence>
					{pack.content.map((cards, index) => (
						<CardsContext.Provider
							// TODO: generate a better key
							key={cards.uuid}
							value={{
								term: cards.term,
								definition: cards.definition,
								category: cards.category,
								uuid: cards.uuid,
								id: index,
							}}
						>
							<Cards editing />
						</CardsContext.Provider>
					))}
				</AnimatePresence>
			</motion.div>

			<div id="parentToolbar" className="d-flex justify-content-between fixed-bottom">
				<ButtonGroup className="mx-auto fw-bold" id="bottomToolbar">
					<Button variant="light" onClick={saveCards} className="p-3">
						{saving ? (
							<Spinner animation="border" variant="dark" size="sm" />
						) : (
							'💾 Save'
						)}
					</Button>
					<LinkContainer to={`/view/${pack.author}/${pack.uuid}`}>
						<Button variant="light" onClick={saveCards} className="p-3">
							↩ Return
						</Button>
					</LinkContainer>
				</ButtonGroup>
			</div>
		</div>
	)
}

export default EditPack
