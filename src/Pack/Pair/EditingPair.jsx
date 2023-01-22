import React from 'react'
import { useState } from 'react'
import { CardsContext, EditorContext, PackContext } from '@/lib/context'

import Button from 'react-bootstrap/Button'

function EditingPair(props) {
    const cards = React.useContext(CardsContext)
    const pack = React.useContext(PackContext)
    const editor = React.useContext(EditorContext)

    const [term, setTerm] = useState(cards.term)
    const [definition, setDefinition] = useState(cards.definition)

    // TODO: Spin-out this logic or keep it here?
    async function exitEditingMode() {
        // When the user clicks "Done" and the component will be switched to the static version,
        // we send a write to Firebase
        let p = pack
        p.content[cards.id].term = term
        p.content[cards.id].definition = definition

        editor.setPack({...p})

        // Self-destruct
        // No other code below here
        props.setEditing(!props.editing)
    }

    return (
        // <div>
        //     <form>
        //         <label>
        //             Term
        //             <input
        //                 type="text"
        //                 value={term}
        //                 onChange={(e) => setTerm(e.target.value)}
        //             />
        //         </label>

        //         <label>
        //             Definition
        //             <input
        //                 type="text"
        //                 value={definition}
        //                 onChange={(e) => setDefinition(e.target.value)}
        //             />
        //         </label>
        //     </form>
        //     <button onClick={exitEditingMode}>
        //         Done
        //     </button>
        // </div>

        <form>
            <div className="container overflow-hidden text-center">
                <div className="row">
                    <div className="col p-2">
                        <div className="p-2 py-4 shadow-sm bg-light rounded-3">
                            <input
                                className="text-center"
                                type="text"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col p-2">
                        <div className="p-2 py-4 shadow-sm bg-light rounded-3">
                            <input
                                className="text-center"
                                type="text"
                                value={definition}
                                onChange={(e) => setDefinition(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>

            <Button variant="success" size="sm" onClick={exitEditingMode}>
                Done
            </Button>
        </form>
    )
}

export default EditingPair
