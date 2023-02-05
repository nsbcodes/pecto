import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '@/lib/context'
import { getMyPacks } from '@/lib/pack'
import UserPacks from './Home/UserPacks'
import './Home.scss'

function Home() {
	const { user, loading } = useContext(UserContext)
	const [usersPacks, setUsersPacks] = useState([])

	useEffect(() => {
		async function fetchData() {
			setUsersPacks(await getMyPacks(user.displayName))
		}
		if (usersPacks.length == 0 && !loading) fetchData()
	}, [loading])

	try {
		user.displayName
	} catch {
		return (
			<div className="container text-center">
				<div className="m-3">Sign in for a personalized home-page</div>
			</div>
		)
	}
	return (
		<div className="container">
			<div className="m-3">
				<h3>Your Packs</h3>
				<UserPacks packs={usersPacks} />
			</div>
		</div>
	)
}

export default Home
