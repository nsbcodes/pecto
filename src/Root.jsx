import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

// Auth
import { auth, authenticateWithGoogle, signOutOfGoogle } from '@/lib/firebase'
import { getUsername, getDisplayName } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from '@/lib/context'

import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import './Root.scss'

import { useUser } from '@/stores/user'
import { shallow } from 'zustand/shallow'

import { debounce } from './lib/utilities'

function Root() {
	const [user, loading, error] = useAuthState(auth)
	const [setUser] = useUser((state) => [state.setUser], shallow)
	const navigate = useNavigate()

	const [search, setSearch] = useState('')
	const [askForUsername, setAskForUsername] = useState(false)
	const [username, setUsername] = useState('')
	const [usernameAvailable, setUsernameAvailable] = useState('Great Username!')

	useEffect(() => {
		if (user?.displayName == undefined) {
			setUser({})
		} else {
			setUser(user)
		}
	}, [user, loading])

	// Validate the new username
	useEffect(() => {
		async function calcAvailability() {
			setUsernameAvailable('Loading...')
			if (await getUsername(username)) {
				setUsernameAvailable('❌ Username has been taken')
			} else {
				setUsernameAvailable('Great Username!')
			}
		}
		if (username == '') {
			setUsernameAvailable('Please enter a username')
		} else {
			debounce(calcAvailability())
		}
	}, [username])

	async function handleAuthClick() {
		if (user) {
			// Log-Out functionality
			signOutOfGoogle()
		} else {
			// Log-In
			// getDisplayName returns the displayName as the default username
			setUsername(await getDisplayName())
			// Open the modal
			setAskForUsername(true)
		}
	}

	async function confirmUsername() {
		setUsernameAvailable('Saving to database...')
		await authenticateWithGoogle(username)
		askForUsername(false)
	}

	function openSearchPage() {
		navigate(`/search/${encodeURIComponent(search)}`)
	}

	return (
		<>
			<Navbar
				id="navbar"
				bg="light"
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

						<Form className="d-flex" onSubmit={openSearchPage}>
							<Form.Control
								type="search"
								placeholder="Enter Pack Name"
								className="me-2"
								aria-label="Enter Pack Name"
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button type="submit" className="me-2">
								Search
							</Button>
							<Button
								variant={user ? 'danger' : 'success'}
								onClick={handleAuthClick}
								className="text-nowrap"
							>
								{user ? 'Sign Out' : 'Sign in with Google'}
							</Button>
							{/* <LinkContainer to={'/donate'}>
                                <a className="btn btn-primary text-light ms-2">
                                    Donate
                                </a>
                            </LinkContainer> */}
						</Form>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<div id="detail">
				<UserContext.Provider value={{ user: user, loading: loading, error: error }}>
					<Outlet />
				</UserContext.Provider>
			</div>

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
					<Button variant="primary" onClick={confirmUsername}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default Root
