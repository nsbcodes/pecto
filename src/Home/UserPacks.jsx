import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

function UserPacks(props) {
	const [editing, setEditing] = useState(false)
	const [deletePack] = useUser((state) => [state.deletePack], shallow)

	var packsToDelete = []

	function handleDelete() {
		packsToDelete.forEach((uuid) => {
			deletePack(uuid)
		})
		alert('Packs deleted - refresh the page')
	}

	return (
		<>
			<div className="d-flex justify-content-between mb-3">
				<h3 className="align-text-middle">{props.title}</h3>

				{props.canEdit &&
					(editing ? (
						<Button
							variant="danger"
							onClick={() => {
								handleDelete()
								setEditing(false)
							}}
						>
							Confirm Delete (unrecoverable)
						</Button>
					) : (
						<Button
							variant="warning"
							onClick={() => {
								setEditing(true)
							}}
						>
							Bulk Delete
						</Button>
					))}
			</div>

			<div className="container">
				<div className="row row-cols-1 row-cols-sm-3 gy-4">
					{props.canEdit && (
						<div className="col">
							<LinkContainer to={`/new/pack`}>
								<div className="card text-center">
									<div className="card-body">
										<h2>➕</h2>
										<h5>New Pack</h5>
									</div>
								</div>
							</LinkContainer>
						</div>
					)}

					{props.packs.map((pack) => (
						<div className="col" key={pack.uuid}>
							<LinkContainer to={`/view/${pack.author}/${pack.uuid}`}>
								<div className="card">
									<div className="card-body">
										<h5 className="card-title">
											{pack.name == '' ? (
												<span className="text-muted">Empty Title</span>
											) : (
												pack.name
											)}
										</h5>
										<h6 className="card-subtitle mb-2 text-muted">
											✏️ {pack.superficialAuthor}
										</h6>
										For{' '}
										{pack.class == '' ? (
											<span className="text-muted">N/A</span>
										) : (
											pack.class
										)}
										<br />
										Created on {pack.date}
									</div>
								</div>
							</LinkContainer>

							{props.canEdit && editing && (
								<div className="mt-2">
									<Form.Check
										reverse
										label="Remove"
										onClick={(e) => {
											if (e.target.checked == true) {
												packsToDelete.push(pack.uuid)
											} else {
												packsToDelete = packsToDelete.filter(
													(e) => e != pack.uuid
												)
											}
										}}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default UserPacks
