import React from 'react'
import { CardsContext } from '@/lib/context'

function StaticPair() {
    const cards = React.useContext(CardsContext)

    // Muy padding
    return (
        <div className="container overflow-hidden text-center">
            <div className="row">
                <div className="col p-2">
                    <div className="p-2 py-4 shadow-sm bg-light rounded-3">
                        {(cards.term == '') ? (
                            <span className="text-muted">Term {cards.id+1}</span>
                        ) : cards.term}
                    </div>
                </div>
                <div className="col p-2">
                    <div className="p-2 py-4 shadow-sm bg-light rounded-3">
                        {(cards.definition == '') ? (
                            <span className="text-muted">Definition {cards.id+1}</span>
                        ) : cards.definition}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaticPair
