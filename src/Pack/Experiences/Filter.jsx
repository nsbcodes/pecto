import React, { useState } from 'react'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export function Filter({ disabled = false }) {
	const [pack, filterPackCategory, filterPackStarred] = usePack(
		(state) => [state.defaultPack, state.filterPackCategory, state.filterPackStarred],
		shallow
	)

	// Category filter
	const [categoryFilter, setCategoryFilter] = useState(0)

	// Starred filter
	const [starredFilter, setStarredFilter] = useState(0)

	return (
		<div
			className="d-flex justify-content-between align-items-baseline"
			style={{ marginTop: '-0.75rem' }}
		>
			<div>
				<Button
					variant="light"
					size="sm"
					className="me-3"
					inline="true"
					onClick={() => {
						setStarredFilter(0)
						setCategoryFilter(0)
						filterPackStarred(0)
						filterPackCategory(0)
					}}
					disabled={disabled}
				>
					🔄
				</Button>
				<Form.Check
					className="mt-3"
					label={starredFilter === 0 ? 'Starred Filter (Disabled)' : 'Starred Filter'}
					type="checkbox"
					inline="true"
					onChange={(e) => {
						filterPackStarred(e.target.checked)
						// TODO: very very very complicated
						// allow editing in filtered packs
						// will require us to a	dd uuids for each card
						setStarredFilter(e.target.checked)
					}}
					value={starredFilter}
					disabled={disabled}
				/>
			</div>
			<Form.Select
				className="w-25"
				onChange={(e) => {
					filterPackCategory(categoryFilter)
					setCategoryFilter(e.target.value)
				}}
				value={categoryFilter}
				disabled={disabled}
			>
				<option value="0">All Categories</option>
				{Object.entries(pack.categories).map(([uuid, content]) => (
					<option key={uuid} value={uuid} style={{ backgroundColor: content.colors[1] }}>
						{content.name}
					</option>
				))}
			</Form.Select>
		</div>
	)
}
