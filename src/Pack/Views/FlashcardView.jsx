import React, { useEffect, useState, useMemo } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { usePack } from '@/stores/pack'
import { shallow } from 'zustand/shallow'
import { Markup } from '@/lib/Markup'

import './FlashcardView.scss'

import MultipleChoice from './MultipleChoice'
import { shuffle as shuffleFunction } from '@/lib/utilities'

export function FlashcardView() {
	const [pack, editing] = usePack((state) => [state.pack, state.editing], shallow)
	const [currentCard, setCurrentCard] = useState(0)
	const [switchedTerm, setSwitchedTerm] = useState(false)
	const [shuffle, setShuffle] = useState(false)
	const content = useMemo(
		() => (shuffle ? shuffleFunction(pack.content) : pack.content),
		[pack, shuffle]
	)

	// Term/Definition switch click
	const [showDefinition, setShowDefinition] = useState(false)

	// Options
	const [mcqMode, setMcqMode] = useState(false)

	// Arrow Keys Navigation
	function handleKey(e) {
		if (e.key === 'ArrowRight' && currentCard + 1 < content.length) {
			setShowDefinition(mcqMode)
			setCurrentCard(currentCard + 1)
		} else if (e.key === 'ArrowLeft' && currentCard - 1 >= 0) {
			setShowDefinition(mcqMode)
			setCurrentCard(currentCard - 1)
		} else if (e.key === ' ' && !mcqMode) {
			e.preventDefault()
			setShowDefinition(!showDefinition)
		}
	}

	function smallText(text) {
		return text.length > 150 || text.split('<p>').length > 3 || text.includes('<h')
	}

	// All state referenced must be in the dependency array
	useEffect(() => {
		if (!editing) {
			document.addEventListener('keydown', handleKey)
		}
		return () => {
			document.removeEventListener('keydown', handleKey)
		}
	}, [mcqMode, editing, currentCard, showDefinition])

	if (content.length == 0) {
		return (
			<div className="container bg-dark text-light rounded-3 py-4 shadow-lg mt-3">
				<div className="container">
					<h3 className="text-center text-muted">No cards match your filters</h3>
				</div>
			</div>
		)
	}

	return (
		<div className="container bg-dark text-light rounded-3 py-4 shadow-lg mt-3">
			<div className="container">
				{/* Mode Options */}
				<div className="d-flex justify-content-start mb-4">
					<Form.Check
						className="me-3"
						type="switch"
						label="Multiple Choice Mode"
						checked={mcqMode}
						onChange={(e) => {
							if (content.length >= 4) {
								setShowDefinition(false)
								setMcqMode(e.target.checked)
							} else {
								alert('Add at least 4 cards to enable Multiple Choice mode')
							}
							if (e.target.checked == true) setShowDefinition(true)
						}}
					/>
					<Form.Check
						className="me-3"
						type="switch"
						label="Switch Term and Definition"
						checked={switchedTerm}
						onChange={(e) => setSwitchedTerm(e.target.checked)}
					/>
					<Form.Check
						type="switch"
						label="Shuffle"
						checked={shuffle}
						onChange={(e) => setShuffle(e.target.checked)}
					/>
				</div>

				{/* Flashcard */}
				<div
					key={content[currentCard][showDefinition ? 'definition' : 'term']}
					className="shadow rounded-3 bg-secondary mx-auto text-center d-flex justify-content-center px-5 align-items-center flashCard"
					onClick={() => {
						if (!mcqMode) setShowDefinition(!showDefinition)
					}}
				>
					{(showDefinition && !switchedTerm) || (!showDefinition && switchedTerm) ? (
						<div
							className={
								smallText(content[currentCard]['definition'])
									? 'fcTextSmall'
									: 'fcTextBig'
							}
						>
							<Markup dark content={content[currentCard]['definition']} />
						</div>
					) : (
						<div
							className={
								smallText(content[currentCard]['term'])
									? 'fcTextSmall'
									: 'fcTextBig'
							}
						>
							{content[currentCard]?.picture !== undefined && (
								<img
									className="w-100 mb-5 rounded-3 shadow"
									src={content[currentCard]['picture']}
								></img>
							)}
							<Markup dark content={content[currentCard]['term']} />
						</div>
					)}
				</div>

				{/* Multiple Choice */}
				{mcqMode && (
					<MultipleChoice currentCard={currentCard} setCurrentCard={setCurrentCard} />
				)}

				{/* Messy controls */}
				<div className="d-flex justify-content-evenly mt-5" key={currentCard}>
					{currentCard - 1 < 0 ? (
						<Button variant="light" disabled>
							Previous
						</Button>
					) : (
						<Button
							variant="light"
							onClick={() => {
								setShowDefinition(false)
								setCurrentCard(currentCard - 1)
							}}
						>
							Previous
						</Button>
					)}

					{/* Current Card */}
					<span className="align-middle">
						{currentCard + 1}/{content.length}
					</span>

					{currentCard + 1 >= content.length ? (
						<Button variant="light" disabled>
							Next
						</Button>
					) : (
						<Button
							variant="light"
							onClick={() => {
								setShowDefinition(false)
								setCurrentCard(currentCard + 1)
							}}
						>
							Next
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
