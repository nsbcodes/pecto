import Dexie from 'dexie'
import { BasePack } from './schema'

const db = new Dexie('packs')

db.version(1).stores({
	packs: `id,${Object.keys(BasePack()).join(',')}`,
})

// No error catching
// my code doesn't make errors

const addNewPack = async (id, newPack) => {
	await db.packs.put({ id: id, ...newPack })
}

const deletePack = async (id) => {
	await db.packs.delete(id)
}

const getMyPacks = async () => {
	return await db.packs.toArray()
}

export { db, addNewPack, deletePack, getMyPacks }
