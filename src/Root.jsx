import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

// Auth
import { auth, authenticateWithGoogle, getUser, signOutOfGoogle } from '@/lib/firebase'
import { getUsername, initUser } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ThemeContext } from '@/lib/context'

import { Outlet } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import './Root.scss'
import './themes/light.scss'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

import { debounce } from './lib/utilities'
import Theme from './Theme'
import { Themes } from './Themes'

function Root() {
	const [user, loading] = useAuthState(auth)
	const [setUser] = useUser((state) => [state.setUser], shallow)
	// const navigate = useNavigate()

	// const [search, setSearch] = useState('')
	const [askForUsername, setAskForUsername] = useState(false)
	const [username, setUsername] = useState('')
	const [usernameAvailable, setUsernameAvailable] = useState('Great Username!')
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 0)

	useEffect(() => {
		if (user?.displayName == undefined) {
			setUser({})
		} else {
			setUser(user)
		}
	}, [user, loading])

	// Validate the new username
	useEffect(() => {
		async function checkAvailability() {
			if ((await getUsername(username)) !== undefined) {
				setUsernameAvailable('❌ Username has been taken')
			}
		}

		function checkUsername() {
			// Between 3 and 20 characters
			let correctLength = username.length >= 3 && username.length <= 20
			// // ASCII
			// let correctCharacters = ![...username].some((char) => char.charCodeAt(0) > 127)
			// Overlaps with ASCII but checks for no spaces, only alphanumeric
			let alphaNumeric = /^[\w-]+$/.test(username)
			if (!correctLength || !alphaNumeric) {
				setUsernameAvailable(
					'Username must be between 3 and 20 characters, not include spaces, and contain no special characters'
				)
			}
		}

		if (username == '') {
			setUsernameAvailable('Please enter a username')
		} else {
			setUsernameAvailable('Great Username!')
			checkUsername()
			debounce(checkAvailability())
		}
	}, [username])

	// Lazy-load other themes
	// We need to use a glob since we can't use import.meta.url for a dynamic import
	useEffect(() => {
		Themes.forEach((theme) => async () => {
			if (theme.id !== 'light') await import(`./themes/${theme.id}.theme.scss`)
		})
	}, [])

	useEffect(() => {
		const applyTheme = async () => {
			document.documentElement.setAttribute('data-bs-theme', Themes[theme].color)
			document.documentElement.setAttribute('theme', Themes[theme].id)
			localStorage.setItem('theme', theme)
		}
		if (Themes[theme] !== undefined) applyTheme()
	}, [theme])

	async function handleAuthClick() {
		if (user) {
			// Log-Out functionality
			signOutOfGoogle()
		} else {
			// Log-In
			let user = await initUser()
			if ((await getUser(user.uid)) === undefined) {
				// initUser returns the displayName as the default username
				setUsername(await user.displayName)
				// Open the modal
				setAskForUsername(true)
			}
		}
	}

	async function confirmUsername() {
		setUsernameAvailable('Saving to database...')
		await authenticateWithGoogle(username)
		setAskForUsername(false)
		window.location.reload()
	}

	// function openSearchPage() {
	// 	navigate(`/search/${encodeURIComponent(search)}`)
	// }

	return (
		<>
			<Navbar
				id="navbar"
				data-bs-theme={Themes[theme]?.color}
				expand="lg"
				className="shadow-sm rounded-3 position-absolute fixed-top"
			>
				<Container fluid>
					<LinkContainer to={'/'}>
						<Navbar.Brand className="fw-bold">📎 Pecto</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav
							className="me-auto my-2 my-lg-0"
							style={{ maxHeight: '100px' }}
							navbarScroll
						>
							<LinkContainer to={'/'}>
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>

							<NavDropdown title="New">
								<LinkContainer to={`/new/pack/`}>
									<NavDropdown.Item>Pack</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>
						</Nav>

						<div className="d-flex justify-content-between">
							<Theme theme={theme} setTheme={setTheme} />
							<Button
								variant={user ? 'danger' : 'success'}
								onClick={handleAuthClick}
								className="text-nowrap"
							>
								{user ? 'Sign Out' : 'Sign in with Google'}
							</Button>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<ThemeContext.Provider value={Themes[theme]}>
				<div id="detail">
					<Outlet />
				</div>
			</ThemeContext.Provider>

			{/* Username sign-in modal */}
			<Modal show={askForUsername}>
				<Modal.Header>
					<Modal.Title>Create a Username</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Control
						value={username}
						onChange={(e) => {
							setUsername(e.target.value)
						}}
						type="input"
						placeholder="Enter a unique username 3-15 characters long"
						aria-label="Enter a unique username 3-15 characters long"
					/>
					<Form.Text>{usernameAvailable}</Form.Text>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						disabled={!usernameAvailable}
						onClick={confirmUsername}
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default Root
