import React, { useState, useEffect } from 'react'
import { getUsersPacks } from '@/lib/pack'
import UserPacks from './Home/UserPacks'
import { useParams } from 'react-router-dom'
import './Home.scss'

export function UserView() {
	const { displayName } = useParams()
	const [usersPacks, setUsersPacks] = useState([])

	useEffect(() => {
		async function fetchData() {
			setUsersPacks(await getUsersPacks(displayName))
		}
		fetchData()
	}, [])

	if (usersPacks.length == 0) {
		return (
			<div className="container text-center">
				<div className="m-3">Profile not found</div>
			</div>
		)
	}

	return (
		<div className="container">
			<div className="m-3">
				<h3>{`${displayName}'s Packs`}</h3>
				<UserPacks packs={usersPacks} />
			</div>
		</div>
	)
}
