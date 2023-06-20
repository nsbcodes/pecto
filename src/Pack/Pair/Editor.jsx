import React from 'react'

import { Remirror, useRemirror } from '@remirror/react'
import { ExtensionPriority } from 'remirror'
import {
	BlockquoteExtension,
	BoldExtension,
	BulletListExtension,
	CodeBlockExtension,
	CodeExtension,
	HardBreakExtension,
	HeadingExtension,
	ItalicExtension,
	LinkExtension,
	ListItemExtension,
	OrderedListExtension,
	StrikeExtension,
	TableExtension,
	// MarkdownExtension,
} from 'remirror/extensions'

import 'remirror/styles/all.css'
import './Editor.scss'

export const Editor = ({ content, save }) => {
	const { manager } = useRemirror({
		// All of these extensions must be translatable to a default html element
		extensions: () => [
			new LinkExtension({ autoLink: true }),
			new BoldExtension(),
			new StrikeExtension(),
			new ItalicExtension(),
			new HeadingExtension(),
			new BlockquoteExtension(),
			new BulletListExtension({ enableSpine: true }),
			new OrderedListExtension(),
			new ListItemExtension({ priority: ExtensionPriority.High, enableCollapsible: true }),
			new CodeExtension(),
			// TODO: select languages to add to code blocks
			new CodeBlockExtension(),
			new TableExtension(),
			// new MarkdownExtension({ copyAsMarkdown: false }),
			/**
			 * `HardBreakExtension` allows us to create a newline inside paragraphs.
			 * e.g. in a list item
			 */
			new HardBreakExtension(),
		],
		stringHandler: 'html',
	})

	// Add the state and create an `onChange` handler for the state.
	return (
		<div className="remirror-theme">
			<Remirror
				autoRender={'end'}
				manager={manager}
				initialContent={content}
				// TODO: can we connect this to our zustand store through props?
				// https://remirror.io/docs/advanced/updating-editor-externally/
				onChange={({ helpers, state }) => {
					save(helpers.getHTML(state))
				}}
			/>
		</div>
	)
}
