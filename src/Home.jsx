import React, { useState, useEffect } from 'react'
import UserPacks from './Home/UserPacks'
import './Home.scss'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'
import { getMyPacks as getMyPacksLocal } from '@/lib/localstore'

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

function Home() {
	const [user, newPack, deletePack, getMyPacks] = useUser(
		(state) => [state.user, state.newPack, state.deletePack, state.getMyPacks],
		shallow
	)
	const [usersPacks, setUsersPacks] = useState([])
	const [localPacks, setLocalPacks] = useState([])

	useEffect(() => {
		async function fetchData() {
			setUsersPacks(await getMyPacks())
		}
		fetchData()
	}, [user])

	useEffect(() => {
		async function fetchData() {
			setLocalPacks(await getMyPacksLocal())
		}
		fetchData()
	}, [])

	return (
		<div className="container">
			<div className="m-3">
				<h3>Your Packs</h3>
				<UserPacks canEdit packs={usersPacks} />

				{localPacks.length > 0 && user?.uid !== undefined && (
					<>
						<h3 className="mt-3">Manage Local Packs</h3>
						<ListGroup className="mt-3">
							{localPacks.map((pack) => (
								<ListGroup.Item key={pack.uuid}>
									<div className="d-flex justify-content-between">
										<div>
											{pack.name == '' ? (
												<span className="text-muted">No Name</span>
											) : (
												<span>{pack.name}</span>
											)}
										</div>
										<div>
											<Button
												variant="light"
												size="sm"
												className="ms-2"
												onClick={async () => {
													await newPack(pack.uuid, {
														...pack,
														uid: user.uid,
														superficialAuthor: user.username,
													})
													window.location.reload()
												}}
											>
												Upload
											</Button>
											<Button
												variant="danger"
												size="sm"
												className="ms-2 me-2"
												onClick={deletePack(pack.uuid, true)}
											>
												Delete
											</Button>
											📖{' '}
											{pack.class == '' ? (
												<span className="text-muted me-2">No Name</span>
											) : (
												<span className="me-2">pack.class</span>
											)}
											📅 {pack.date}
										</div>
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					</>
				)}

				<div className="d-flex justify-content-center text-muted font-monospace fw-bold text-uppercase mt-2 mb-2">
					Import
				</div>

				<div className="row row-cols-1 row-cols-sm-3 gy-4 mb-2">
					{[
						{ icon: '📲', description: 'Import Quizlet' },
						{ icon: '📋', description: 'Import from Text (Pecto)' },
						{ icon: '📁', description: 'Import from File' },
					].map((action) => (
						<div className="col" key={action.description}>
							<div className="card text-center" key={action.description}>
								<div className="card-body">
									<h2>{action.icon}</h2>
									<h5>{action.description}</h5>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="d-flex justify-content-center text-muted font-monospace fw-bold text-uppercase mb-2">
					Organization
				</div>

				<div className="row row-cols-1 row-cols-sm-3 gy-4">
					{[
						{ icon: '📂', description: 'Create Folder' },
						{ icon: '📖', description: 'Create Class' },
					].map((action) => (
						<div className="col" key={action.description}>
							<div className="card text-center" key={action.description}>
								<div className="card-body">
									<h2>{action.icon}</h2>
									<h5>{action.description}</h5>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Home
