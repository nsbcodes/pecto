import Dexie from 'dexie'
import { BasePack } from './schema'

const db = new Dexie("packs")

db.version(1).stores({
	packs: `id, ${Object.keys(BasePack()).join(', ')}`
})

// No error catching
// my code doesn't make errors

const addNewPack = async(id, newPack) => {
	// TODO: fix lazy
	await db.packs.delete(id)
	await db.packs.add({ id: id, ...newPack })
}

const deletePack = async(id) => {
	await db.packs.delete(id)
}

const getMyPacks = async () => {
	return await db.packs.toArray()
}

export { db, addNewPack, deletePack, getMyPacks }