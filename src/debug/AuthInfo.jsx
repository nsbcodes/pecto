import React from 'react'
import { useContext } from 'react'
import { UserContext } from '@/lib/context'

export function AuthInfo() {
	
	const user = useContext(UserContext).user
	console.log(user)

	const data = [user.displayName, user.email, user.uid]

    return (
		data.map((detail, i) =>
			<li key={i}>
				{detail}
			</li>
		)
	)
}