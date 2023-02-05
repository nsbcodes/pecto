import React from 'react'
import './App.css'
import Pack from './pack/Pack'
import { auth, authenticateWithGoogle, signOutOfGoogle } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from '@/lib/context'
import { AuthInfo } from './debug/AuthInfo'

function App() {
	const [user, loading, error] = useAuthState(auth)

	async function handleAuthClick() {
		if (user) {
			// Log-Out functionality
			signOutOfGoogle()
		} else {
			// Log-In
			authenticateWithGoogle()
		}
	}

	return (
		// TODO: possibly there shall be a cleaner way (prop spreddy)?
		<UserContext.Provider value={{ user: user, loading: loading, error: error }}>
			<code>{user ? <AuthInfo /> : 'Unauthenticated'}</code>
			<button onClick={handleAuthClick}>{user ? 'Sign Out' : 'Sign in with Google'}</button>

			<Pack id="99a12c30-acff-4339-94ce-67d58c343f4b" />
		</UserContext.Provider>
	)
}

export default App
