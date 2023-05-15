import React, { useState, useEffect } from 'react'
import UserPacks from './Home/UserPacks'
import './Home.scss'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'
import { getMyPacks as getMyPacksLocal } from '@/lib/localstore'

import ListGroup from 'react-bootstrap/ListGroup'

function Home() {
	const [user, getMyPacks] = useUser((state) => [state.user, state.getMyPacks], shallow)
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

				{localPacks.length > 0 && (
					<>
						<h3 className="mt-3">Import Local Packs</h3>
						<ListGroup>
							{localPacks.map((pack) => (
								<ListGroup.Item action key={pack.uuid}>
									<div className="d-flex justify-content-between">
										{pack.name == '' ? (
											<span className="text-muted">No Name</span>
										) : (
											<span>pack.name</span>
										)}
										<div>
											📖{' '}
											{pack.class == '' ? (
												<span className="text-muted">No Name</span>
											) : (
												pack.class
											)}
											📅 {pack.date}
										</div>
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					</>
				)}
			</div>
		</div>
	)
}

export default Home
