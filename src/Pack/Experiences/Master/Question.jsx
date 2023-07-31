import React, { useState, useEffect, useContext } from 'react'

import { ThemeContext } from '@/lib/context'
import { shuffle } from '@/lib/utilities'
import { shallow } from 'zustand/shallow'
import { usePack } from '@/stores/pack'

import Button from 'react-bootstrap/Button'
import { Markup } from '@/lib/Markup'

export default function Question({ card, next, correct }) {
	const [getSimilarCards] = usePack((state) => [state.getSimilarCards], shallow)
	const theme = useContext(ThemeContext)
	const [similarCards, setSimilarCards] = useState([])
	const [content, setContent] = useState(null)
	const [clicked, setClicked] = useState(false)

	useEffect(() => {
		setSimilarCards(shuffle(getSimilarCards(card)))
	}, [card])

	useEffect(() => {
		if (clicked) {
			if (clicked === card.uuid) {
				correct()
			}
			setTimeout(() => {
				next()
			}, 1000)
		}
	}, [clicked])

	useEffect(() => {
		if (similarCards === []) return
		setContent(
			similarCards.map((icard) => {
				let variant = theme.dark ? 'outline-light' : 'outline-dark'
				if (clicked && icard.uuid == card.uuid) {
					variant = 'success'
				} else if (icard.uuid === clicked) {
					variant = 'danger'
				}
				return (
					<Button
						key={icard.uuid}
						variant={variant}
						onClick={() => setClicked(icard.uuid)}
						size="lg"
					>
						{icard.term}
					</Button>
				)
			})
		)
	}, [similarCards, clicked])

	return (
		<div className="mb-3 mx-auto card p-3 w-100" style={{ height: '60vh' }}>
			<div className="h-100 d-flex align-items-center justify-content-center me-5">
				<div>
					{/* TODO: add image support */}
					<h1 className="fw-light mb-0 p-5 me-2">
						<Markup content={card.definition} />
					</h1>
				</div>
				<div className="d-grid gap-2">{content}</div>
			</div>
		</div>
	)
}
