import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

// Auth
import { auth, authenticateWithGoogle, signOutOfGoogle } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from '@/lib/context'

import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import './Root.scss'

function Root() {
	const [user, loading, error] = useAuthState(auth)
	const navigate = useNavigate()

	const [search, setSearch] = useState('')

	async function handleAuthClick() {
		if (user) {
			// Log-Out functionality
			signOutOfGoogle()
		} else {
			// Log-In
			authenticateWithGoogle()
		}
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
						<Navbar.Brand className="fw-bold">
							📎 Pecto
						</Navbar.Brand>
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
				<UserContext.Provider
					value={{ user: user, loading: loading, error: error }}
				>
					<Outlet />
				</UserContext.Provider>
			</div>
		</>
	)
}

export default Root
