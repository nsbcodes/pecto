import React from 'react'
import Form from 'react-bootstrap/Form'

import { Themes } from './Themes'

export default function Theme({ theme, setTheme }) {
	return (
		<Form.Select
			value={theme}
			onChange={(e) => {
				localStorage.setItem('theme', e.target.value)
				if (confirm('Would you like to reload the page to apply the theme?'))
					window.location.reload()
				else {
					setTheme(e.target.value)
				}
			}}
			className="w-auto me-2"
		>
			{Themes.map((theme, i) => (
				<option key={theme.id} value={i}>
					{theme.name}
				</option>
			))}
		</Form.Select>
	)
}
