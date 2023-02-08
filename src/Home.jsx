import React, { useState, useEffect } from 'react'
import UserPacks from './Home/UserPacks'
import './Home.scss'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

function Home() {
	const [user, getMyPacks] = useUser((state) => [state.user, state.getMyPacks], shallow)
	const [usersPacks, setUsersPacks] = useState([])

	useEffect(() => {
		async function fetchData() {
			setUsersPacks(await getMyPacks())
		}
		fetchData()
	}, [user])

	// if (user?.displayName !== undefined) {
	// 	return (
	// 		<div className="container text-center">
	// 			<div className="m-3">Sign in for a personalized home-page</div>
	// 		</div>
	// 	)
	// }

	return (
		<div className="container">
			<div className="m-3">
				<h3>Your Packs</h3>
				<UserPacks canEdit packs={usersPacks} />
			</div>
		</div>
	)
}

export default Home
