import { db } from './firebase'
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'

import { db as localDb } from './localstore'

const fetcher = async (id, user) => {
	if (user == 'me') {
		var r = await localDb.packs.get(id)
		// r.exists = () => {
		// 	if (r === undefined) {
		// 		return false
		// 	} else {
		// 		return true
		// 	}
		// }
		// console.log(r.exists())
		return r
	}

	return await getDoc(doc(db, 'packs', user, 'packs', id))
	// if (data.exists()) {
	// 	return data.data()
	// } else {
	// 	return null
	// }
	// return await getDoc(ref).then((r) => r.data())
}

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
		query(collection(db, 'packs', user, 'packs'), where('published', '==', true))
	)
	userPacks.forEach((doc) => {
		console.log(doc.data())
	})

	return packs
}

async function getPacks(user) {
	let packs = []
	const userPacks = await getDocs(
		query(collection(db, 'packs', user, 'packs'), where('published', '==', true))
	)
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})

	return packs
}

export { fetcher, getMyPacks, getUsersPacks, getPacks }
