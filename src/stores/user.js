import { create } from 'zustand'
import {
	addNewPack as addNewPackCloud,
	deletePack as deletePackCloud,
	getMyPacks as getMyPacksCloud,
} from '@/lib/firebase'
import {
	addNewPack as addNewPackLocal,
	deletePack as deletePackLocal,
	getMyPacks as getMyPacksLocal,
} from '@/lib/localstore'

function userDefined(user) {
	if (user?.displayName === undefined) {
		return false
	}
	return true
}

export const useUser = create((set, get) => ({
	user: {},
	setUser: (newUser) => set({ user: newUser }),
	// Utility functions
	newPack: (id, newPack) => {
		if (userDefined(get().user)) {
			console.log("saving 2 cloud")
			addNewPackCloud(id, newPack)
		} else {
			console.log("saving 2 local")
			console.log(newPack)
			addNewPackLocal(id, newPack)
		}
	},
	deletePack: (id) => {
		if (userDefined(get().user)) {
			deletePackCloud(id)
		} else {
			deletePackLocal(id)
		}
	},
	getMyPacks: async () => {
		if (userDefined(get().user)) {
			return await getMyPacksCloud()
		} else {
			return await getMyPacksLocal()
		}
	},
	authenticated: () => {
		if (userDefined(get().user)) {
			return true
		} else {
			return false
		}
	},
}))
