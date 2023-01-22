import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'

// Auth
import { auth, authenticateWithGoogle, signOutOfGoogle, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from '@/lib/context'

import { Outlet } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import './Root.scss'

function Root() {
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
        <>
            <Navbar
                id="navbar"
                bg="light"
                expand="lg"
                className="shadow-sm rounded-3 position-absolute fixed-top"
            >
                <Container>
                    <LinkContainer to={'/'}>
                        <Navbar.Brand className="fw-bold">
                            📎 Pecto
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to={'/'}>
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>

                            <NavDropdown title="New">
                                <LinkContainer to={`/new/pack/`}>
                                    <NavDropdown.Item>Pack</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Button
                                variant={user ? 'danger' : 'primary'}
                                onClick={handleAuthClick}
                            >
                                {user ? 'Sign Out' : 'Sign in with Google'}
                            </Button>
                            <LinkContainer to={'/donate'}>
                                <a className="btn btn-primary text-light ms-2">
                                    Donate
                                </a>
                            </LinkContainer>
                        </Navbar.Text>
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
