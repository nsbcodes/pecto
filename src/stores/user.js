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
			addNewPackCloud(id, newPack)
		} else {
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
	getMyOfflinePacks: async () => {
		return await getMyPacksLocal()
	},
	authenticated: () => {
		if (userDefined(get().user)) {
			return true
		} else {
			return false
		}
	},
}))
