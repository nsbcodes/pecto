import React from 'react'

import { BoldExtension } from 'remirror/extensions'
import { Remirror, useRemirror } from '@remirror/react'

import 'remirror/styles/all.css'

export const MyEditor = () => {
	const { manager, state } = useRemirror({
		extensions: () => [new BoldExtension()],
		// content: '<p>I love <b>Remirror</b></p>',
		selection: 'start',
		stringHandler: 'html',
	})

	return (
		<div className="remirror-theme">
			<Remirror manager={manager} initialContent={state} />
		</div>
	)
}
