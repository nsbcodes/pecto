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
} from 'firebase/firestore'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'

// TODO: Confirm that our Firebase instance can be safely accessed
const firebaseConfig = {
	apiKey: 'AIzaSyDOjwVp0tpl9CIyGnGoO3xl86kFKyIifMU',
	authDomain: 'pecto-5f56.firebaseapp.com',
	projectId: 'pecto-5f56',
	storageBucket: 'pecto-5f56.appspot.com',
	messagingSenderId: '82014698378',
	appId: '1:82014698378:web:7618826d8460ca2fa8e673',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()
const provider = new GoogleAuthProvider()

var user = {}

// Also inits the user
const getDisplayName = async () => {
	try {
		const res = await signInWithPopup(auth, provider)
		user = res.user
		return user.displayName
	} catch (err) {
		console.error(`Authenication failed with ${err}`)
		alert(err.message)
		throw new Error(`Authenication failed with ${err}`)
	}
}

// READ: https://blog.logrocket.com/user-authentication-firebase-react-apps/
const authenticateWithGoogle = async (username) => {
	if (user?.displayName == undefined) {
		await getDisplayName()
	}
	const batch = writeBatch(db)

	// Add to users (uids)
	batch.update(doc(db, 'users', user.uid), {
		name: user.displayName,
		authProvider: 'google',
		email: user.email,
		uid: user.uid,
		username: username,
	})

	// Add to usernames (unique usernames)
	batch.update(doc(db, 'usernames', username), {
		uid: user.uid,
	})

	await batch.commit()
}

const signOutOfGoogle = async () => {
	try {
		await signOut(auth)
	} catch (err) {
		// it look serious
		console.error(`FATAL AUTH ERROR: ${err}`)
		alert(err.message)
	}
}

const addNewPack = async (id, newPack) => {
	const user = getAuth().currentUser
	console.log(user.uid)
	const docRef = doc(db, 'packs', user.uid, 'packs', id)
	await setDoc(docRef, newPack)
}

const deletePack = async (id) => {
	const user = getAuth().currentUser
	const docRef = doc(db, 'packs', user.uid, 'packs', id)
	await deleteDoc(docRef)
}

const getMyPacks = async () => {
	const user = getAuth().currentUser
	let packs = []
	console.log(user)
	const userPacks = await getDocs(collection(db, 'packs', user.uid, 'packs'))
	userPacks.forEach((doc) => {
		packs.push(doc.data())
	})
	return packs
}

const getUsername = async (username) => {
	let u = await getDoc(doc(db, 'usernames', username))
	return u.data()
}

// For whatever reason export default doesn't work with vite in this case
export {
	app,
	db,
	auth,
	authenticateWithGoogle,
	getDisplayName,
	signOutOfGoogle,
	addNewPack,
	deletePack,
	getMyPacks,
	getUsername,
}
