import { initializeApp } from 'firebase/app'
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	deleteDoc,
	getDocs,
	collection,
	writeBatch,
	connectFirestoreEmulator,
} from 'firebase/firestore'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'

// TODO: Confirm that our Firebase instance can be safely accessed
export const firebaseConfig = {
	apiKey: 'AIzaSyDOjwVp0tpl9CIyGnGoO3xl86kFKyIifMU',
	authDomain: 'pecto-5f56.firebaseapp.com',
	projectId: 'pecto-5f56',
	storageBucket: 'pecto-5f56.appspot.com',
	messagingSenderId: '82014698378',
	appId: '1:82014698378:web:7618826d8460ca2fa8e673',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
//connectFirestoreEmulator(db, 'localhost', 8080)
export const auth = getAuth()
export const provider = new GoogleAuthProvider()

var user = {}

// Also inits the user
export const initUser = async () => {
	try {
		const res = await signInWithPopup(auth, provider)
		user = res.user
		return user
	} catch (err) {
		console.error(`Authenication failed with ${err}`)
		alert(err.message)
		throw new Error(`Authenication failed with ${err}`)
	}
}

// READ: https://blog.logrocket.com/user-authentication-firebase-react-apps/
export const authenticateWithGoogle = async (username) => {
	if (user?.displayName == undefined) {
		await initUser()
	}
	console.log(username, user)
	const batch = writeBatch(db)

	// Add to users (uids)
	batch.set(doc(db, 'users', user.uid), {
		name: user.displayName,
		// authProvider: 'google',
		// email: user.email,
		uid: user.uid,
		username: username,
	})

	// Add to usernames (unique usernames)
	batch.set(doc(db, 'usernames', username), {
		uid: user.uid,
	})

	await batch.commit()
}

export const signOutOfGoogle = async () => {
	try {
		await signOut(auth)
	} catch (err) {
		// it look serious
		console.error(`FATAL AUTH ERROR: ${err}`)
		alert(err.message)
	}
}

export const addNewPack = async (id, newPack, username) => {
	const docRef = doc(db, 'packs', username, 'packs', id)
	await setDoc(docRef, newPack)
}

export const deletePack = async (id, username) => {
	const docRef = doc(db, 'packs', username, 'packs', id)
	await deleteDoc(docRef)
}

export const getMyPacks = async (username) => {
	let packs = []
	const userPacks = await getDocs(collection(db, 'packs', username, 'packs'))
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})
	return packs
}

export const getUsername = async (username) => {
	let u = await getDoc(doc(db, 'usernames', username))
	return u.data()
}

export const getUser = async (uid) => {
	let u = await getDoc(doc(db, 'users', uid))
	console.log(u.data()?.username)
	return u.data()?.username
}
