import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom'
import { useClass } from '@/stores/class'

import UserView from '@/UserView'

import './Class.scss'

export default function Class() {
	const classy = useClass((state) => state.classy)
	const status = useClass((state) => state.status)
	const loadClass = useClass((state) => state.loadClass)

	const { teacher, classId } = useParams()

	useEffect(() => {
		loadClass(teacher, classId)
	}, [])

	if (status === 'loading') {
		return <div>Loading...</div>
	}

	if (status !== 'success') {
		return <div>{status.message}</div>
	}

	return (
		<div className="ps-3 container">
			<h1>{classy.title}</h1>
			<p>
				Created by <span className="text-muted">{classy.author}</span>
			</p>

			<h3>Search all Chapters</h3>
			<UserView username="MilkyDeveloper" minimal={true} />

			<h3>Chapter 1</h3>
			<div className="card">
				<div className="card-body">
					<h4 className="card-title">Ch. 1 - Electromagnetism and the Nature of Light</h4>
					<div className="card-subtitle mb-2 text-muted">
						Categories
						<ul>
							<li>
								Light
								<ul>
									<li>
										<b>Cards</b> - 32
									</li>
									<li>
										<b>Difficulty ✨</b> - 3.2/10
									</li>
								</ul>
							</li>
							<li>Electromagnetism</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
