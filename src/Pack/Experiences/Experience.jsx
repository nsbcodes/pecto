import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import { Navigation } from '../Navigation'

export function Experience(props) {
	const { displayName, packId } = useParams()

	// No need to be specfic with selectors here,
	// since we aren't editing the pack
	const [pack, error, loading, loadPack, filterPackCategory] = usePack(
		(state) => [
			state.pack,
			state.error,
			state.loading,
			state.loadPack,
			state.filterPackCategory,
		],
		shallow
	)

	// Category filter
	const [categoryFilter, setCategoryFilter] = useState(0)

	// Load the pack
	useEffect(() => {
		loadPack(displayName, packId)
	}, [])

	// The === is very important, since it must be a boolean, not an error object
	if (error === true) {
		return (
			<div className="text-center">
				<h1>404</h1>
				<p>Sorry, this pack doesn&apos;t exist.</p>
			</div>
		)
	}

	// The error has an error code (e.g. 403, network errors, etc.)
	if (error) {
		return (
			<div className="text-center">
				<h1>403</h1>
				<p>This pack exists, but hasn&apos;t been published.</p>
				<code>{error.toString()}</code>
			</div>
		)
	}

	// Wait for the pack to load
	if (loading) {
		return (
			<div className="text-center">
				<h1>📎</h1>
				<Spinner animation="grow" size="sm" />
			</div>
		)
	}

	// If the filtered content is empty
	if (pack.content.length === 0) {
		return (
			<div className="container">
				<Form.Select
					className="w-25"
					onChange={(e) => {
						filterPackCategory(categoryFilter)
						setCategoryFilter(e.target.value)
					}}
					value={categoryFilter}
				>
					<option value="0">All</option>
					{Object.entries(pack.categories).map(([uuid, content]) => (
						<option
							key={uuid}
							value={uuid}
							style={{ backgroundColor: content.colors[1] }}
						>
							{content.name}
						</option>
					))}
				</Form.Select>

				<div className="text-center">
					<h1>📎</h1>
					<p>This category contains no cards</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container">
			<Navigation baseURL={`${pack.author}/${pack.uuid}`} currentPage={props.name} />

			<Form.Select
				className="w-25"
				onChange={(e) => {
					filterPackCategory(categoryFilter)
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

			{props.children}
		</div>
	)
}
