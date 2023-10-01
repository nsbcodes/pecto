import React, { useState, useEffect } from 'react'
import { getUsersPacks } from '@/lib/pack'
import UserPacks from './Home/UserPacks'
import { useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

const UserView = function () {
	const { displayName } = useParams()
	const [usersPacks, setUsersPacks] = useState([])

	const [includeLocal, setIncludeLocal] = useState(false)

	// Packs to be excluded by default
	const localAuthors = ['NikashM']

	useEffect(() => {
		async function fetchData() {
			setUsersPacks(await getUsersPacks(displayName))
		}
		fetchData()
	}, [])

	if (usersPacks.length == 0) {
		return (
			<div className="container text-center">
				<div className="m-3">
					Profile not found or {displayName} has not published any packs
				</div>
			</div>
		)
	}

	return (
		<div className="container">
			<div className="m-3">
				<h3>{displayName === 'tomes' ? `Tomes` : `${displayName}'s Packs`}</h3>
				{displayName === 'tomes' && (
					<Form.Check
						className="mt-1"
						label="Include GHS packs"
						type="checkbox"
						inline
						onChange={(e) => setIncludeLocal(e.target.checked)}
						checked={includeLocal}
					/>
				)}
				<UserPacks
					packs={
						displayName === 'tomes' && !includeLocal
							? usersPacks.filter(
									(pack) => !localAuthors.includes(pack.superficialAuthor)
							  )
							: usersPacks
					}
				/>
			</div>
		</div>
	)
}

export default UserView
