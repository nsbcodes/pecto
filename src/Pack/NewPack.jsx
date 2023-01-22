import React, { useContext, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/lib/context'

import Spinner from 'react-bootstrap/Spinner'

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
        async function newPack() {
			// This is basically our schema
			let newPack = {
				name: '',
				class: '',
				author: user.displayName,
				date: new Date(Date.now()).toLocaleString().split(',')[0],
				uid: user.uid,
				uuid: id,
				published: false,
				categories: {'Default': ['transparent', 'transparent']},
				content: [
					{
						term: '',
						definition: '',
						category: 'Default'
					},
				],
			}
			
			// Abstract this specific line
			const docRef = doc(db, "packs", user.displayName, "packs", id)
			await setDoc(docRef, newPack)
			console.log(`${id} has been created`)
			navigate(`/view/${user.displayName}/${id}`)
		}
		if (user != undefined) newPack()
    }, [])

    return (
		<div className="d-flex justify-content-center">
			<Spinner animation="border" variant="dark" size="lg"/>
		</div>
	)
}