import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

/**
 * Boilerplate for Game Mode
 *
 * @component
 */
function _() {
	const { displayName, packId } = useParams()

	const [pack, error, loading, loadPack] = usePack(
		(state) => [
			// Data
			state.pack,
			state.error,
			state.loading,
			state.loadPack,
		],
		shallow
	)

	// Category filter
	const [categoryFilter, setCategoryFilter] = useState(0)
	const [filteredPack, setFilteredPack] = useState(pack)

	useEffect(() => {
		loadPack(displayName, packId)
	}, [])

	useEffect(() => {
		if (categoryFilter == 0) {
			setFilteredPack(pack)
		} else {
			setFilteredPack({
				...pack,
				content: pack.content.filter((cards) => cards.category == categoryFilter),
			})
		}
	}, [categoryFilter, pack])

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

	// Loading logic
	// Also wait for the filteredPack to load
	if (loading || pack?.uuid != packId || filteredPack?.content === undefined) {
		return (
			<div className="text-center">
				<h1>📎</h1>
				<Spinner animation="grow" size="sm" />
			</div>
		)
	}

	return (
		<Form.Select
			className="w-25"
			onChange={(e) => {
				setCategoryFilter(e.target.value)
			}}
			value={categoryFilter}
		>
			<option value="0">All</option>
			{Object.entries(pack.categories).map(([uuid, content]) => (
				<option key={uuid} value={uuid} style={{ backgroundColor: content.colors[1] }}>
					{content.name}
				</option>
			))}
		</Form.Select>
	)
}

export default _
