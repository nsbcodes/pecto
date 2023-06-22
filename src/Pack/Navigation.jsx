import React from 'react'

import Nav from 'react-bootstrap/Nav'

export function Navigation({ baseURL, currentPage }) {
	return (
		<Nav className="mb-3" variant="pills" defaultActiveKey={currentPage}>
			{[
				{ link: 'view', text: 'View' },
				{ link: false, text: 'Experiences' },
				{ link: 'blitz', text: 'Blitz' },
				{ link: 'master', text: 'Master' },
				{ link: false, text: 'Utilities' },
				{ link: 'comprehend', text: 'Comprehend' },
				{ link: 'assess', text: 'Assess' },
			].map(({ link, text }) => (
				<Nav.Item key={text}>
					<Nav.Link
						{...(link ? { href: `/${link}/${baseURL}` } : { disabled: true })}
						eventKey={link}
					>
						{text}
					</Nav.Link>
				</Nav.Item>
			))}
		</Nav>
	)
}
