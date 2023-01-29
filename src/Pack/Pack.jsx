import React, { useContext, useEffect, useState } from 'react'
import { fetcher } from '@/lib/pack'
import Cards from './Cards'
import { CardsContext, PackContext, UserContext, EditorContext } from '@/lib/context'
import { Metadata } from './Metadata'
import { useParams } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'

import FlashcardView from './Views/FlashcardView'

import './Pack.scss'

import { StoreInstance as Store } from '@/lib/store'

import { AnimatePresence } from 'framer-motion'

function Pack() {
    const { displayName, packId } = useParams()
    // We wrap useState around this so we can modify it (ex. adding new cards)
    //const { pack: ogPack, mutate, isLoading, error } = usePack(packId)
    const [pack, setPack] = useState({})
    //const { pack, setPack } = useState(ogPack)
    const user = useContext(UserContext).user

    // For a saving progress spinner
    const [saving, startSaving] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setPack(await fetcher(packId, displayName))
        }
        fetchData()
    }, [])

    // if (error) return <div>Could not retrieve test.json - make dynamic</div>
    // if (isLoading) return <div>Loading</div>
    if (pack.content === undefined) {
        return <div>Pack Not Found</div>
    }

    let editor = false

    // TODO: Fix the below code
    // it works but messy
    try {
        if (user.uid == pack.uid) editor = true
    } catch (err) {
        editor = false
    }

    if (displayName == "me") editor = true

    async function newCards() {
        // Add new terms
        pack.content.push({
            term: '',
            definition: '',
            category: 'Default'
        })
        setPack({ ...pack })
    }

    async function saveCards() {
        startSaving(true)

        // We aren't actually creating a new pack, this also edits it
        Store.newPack(packId, pack)

        startSaving(false)
    }

    return (
        <div id="packRoot" className="mx-auto border border-2 p-4 rounded-3">

            <EditorContext.Provider value={{ editor: editor, setPack: setPack }}>
                <PackContext.Provider value={pack}>
                    <Metadata />

                    <FlashcardView />

                    <div id="packContentContainer" className="mt-3 border border-2 rounded-3 p-4">
                        <AnimatePresence>
                            {pack.content.map((cards, index) => (
                                <CardsContext.Provider
                                    key={index}
                                    value={{
                                        term: cards.term,
                                        definition: cards.definition,
                                        category: cards.category,
                                        id: index,
                                    }}
                                >
                                    <Cards />
                                </CardsContext.Provider>
                            ))}
                        </AnimatePresence>
                    </div>
                </PackContext.Provider>
            </EditorContext.Provider>
            
            {editor ? (
                <div id="parentToolbar" className="d-flex justify-content-between fixed-bottom" style={{transform: 'translateY(-75%)'}}>
                    <ButtonGroup className="mx-auto mt-3 fw-bold" id="bottomToolbar">
                        <Button variant="light" onClick={newCards} className="p-4">
                            ➕ New
                        </Button>
                        <Button variant="light" onClick={saveCards} className="p-4">
                            {saving ? (
                                <Spinner animation="border" variant="light" size="sm"/>
                            ) : "💾 Save"}
                        </Button>
                    </ButtonGroup>
                </div>
            ) : null}
        </div>
    )
}

export default Pack
