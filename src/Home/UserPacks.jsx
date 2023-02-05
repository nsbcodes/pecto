import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

function UserPacks(props) {
	return (
		<div className="container">
			<div className="row">
				{props.packs.map((pack) => (
					<div className="col" key={pack.uuid}>
						<LinkContainer to={`/view/${pack.author}/${pack.uuid}`}>
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">
										{pack.name == '' ? (
											<span className="text-muted">
												Empty Title
											</span>
										) : (
											pack.name
										)}
									</h5>
									<h6 className="card-subtitle mb-2 text-muted">
										@{pack.author}
									</h6>
									For{' '}
									{pack.class == '' ? (
										<span className="text-muted">N/A</span>
									) : (
										pack.class
									)}
									<br />
									Created on {pack.date}
								</div>
							</div>
						</LinkContainer>
					</div>
				))}
			</div>
		</div>
	)
}

export default UserPacks
