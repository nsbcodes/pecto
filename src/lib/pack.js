import { db } from './firebase'
import {
	doc,
	getDoc,
	getDocs,
	collection,
	query,
	where,
} from 'firebase/firestore'

const fetcher = (id, user) =>
	getDoc(doc(db, 'packs', user, 'packs', id)).then((r) => r.data())

async function getMyPacks(user) {
	let packs = []
	const userPacks = await getDocs(collection(db, 'packs', user, 'packs'))
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})

	return packs
}

async function getUsersPacks(user) {
	let packs = []
	const userPacks = await getDocs(
		query(
			collection(db, 'packs', user, 'packs'),
			where('published', '==', true)
		)
	)
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})

	return packs
}

async function getPacks(searchTerm) {
	let packs = []
	const userPacks = await getDocs(
		query(
			collection(db, 'packs', user, 'packs'),
			where('published', '==', true)
		)
	)
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})

	return packs
}

export { fetcher, getMyPacks, getUsersPacks, getPacks }
