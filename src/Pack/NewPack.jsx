import React, { useContext, useEffect } from 'react'
import { StoreInstance as Store } from '@/lib/store'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/lib/context'

import Spinner from 'react-bootstrap/Spinner'

import { BasePack } from '@/lib/schema'

import { v4 as uuidv4 } from 'uuid'

// READ: https://beta.reactjs.org/learn/you-might-not-need-an-effect#initializing-the-application
// READ: https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
// React Strict Mode renders components twice for reccomendations on your code,
// sending unnecessary API calls. Normally this isn't a problem, but this creates
// double the documents, which is annoying to clean up in Firestore
//
// This is why we use an id variable

export function NewPack() {

	const user = useContext(UserContext).user
	const navigate = useNavigate()

	var id = uuidv4()

	useEffect(() => {
		if (user === null) {
			Store.newPack(id, BasePack())
			navigate(`/view/me/${id}`)
		} else {
			Store.newPack(id, {...BasePack(), uid: user.uid})
			navigate(`/view/${user.displayName}/${id}`)
		}
    }, [])

    return (
		<div className="d-flex justify-content-center">
			<Spinner animation="border" variant="dark" size="lg"/>
		</div>
	)
}