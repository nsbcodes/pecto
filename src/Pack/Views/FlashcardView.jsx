import { PackContext } from '@/lib/context'
import React, { useContext, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'

import { motion } from "framer-motion"

function FlashcardView() {
	const pack = useContext(PackContext)
	const [currentCard, setCurrentCard] = useState(0)

	// Term/Definition switch click
	const [clicked, setClicked] = useState(false)

	useEffect(() => {
		// Always go to the term on the next card
		setClicked(false)
	}, [currentCard])

    return (
		<motion.div animate={{ y: 0 }} initial={{ y: 50 }} className="container bg-dark text-light rounded-3 py-5 shadow-lg mt-3">
			
			<div className="container">
				{ clicked ? (
					<div style={{position: 'relative'}}>
						<motion.div animate={{ opacity: 100 }} initial={{ opacity: 0 }} className="shadow bg-secondary rounded-3 w-75 mx-auto text-center position-absolute top-50 start-50 translate-middle" style={{paddingTop: "7rem", paddingBottom: "7rem", position: 'absolute'}}>a</motion.div>
						<motion.div animate={{ rotate: -5 }} initial={{ rotate: 0 }} key={pack.content[currentCard]["definition"]} className="shadow rounded-3 bg-secondary w-75 mx-auto text-center"
						style={{paddingTop: "7rem", paddingBottom: "7rem"}}
						onClick={() => setClicked(!clicked)}>
							<h3>
								{pack.content[currentCard]["definition"]}
							</h3>
						</motion.div>
					</div>
				) : (
					<motion.div animate={{ rotate: 0, x: 0 }} initial={{ rotate: -5, x: 25 }} key={pack.content[currentCard]["term"]} className="shadow rounded-3 bg-secondary w-75 mx-auto text-center"
					style={{paddingTop: "7rem", paddingBottom: "7rem"}}
					onClick={() => setClicked(!clicked)}>
						<h3>
							{pack.content[currentCard]["term"]}
						</h3>
					</motion.div>
				)}

				<motion.div initial={{ x: 25 }} animate={{ x: 0 }} className="d-flex justify-content-evenly mt-5" key={currentCard}>
					{ (currentCard-1 < 0) ? (
						<Button variant="light" disabled>Previous</Button>
					) : (
						<Button variant="light" onClick={() => setCurrentCard(currentCard-1)}>Previous</Button>
					) }

					<span className="align-middle">
						{currentCard+1}/{pack.content.length}
					</span>
					
					{ (currentCard+2 > pack.content.length) ? (
						<Button variant="light" disabled>Next</Button>
					) : (
						<Button variant="light" onClick={() => setCurrentCard(currentCard+1)}>Next</Button>
					) }
				</motion.div>
			</div>

		</motion.div>
	)
}

export default FlashcardView
