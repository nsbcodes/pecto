import { create } from 'zustand'
import {
	addNewPack as addNewPackCloud,
	deletePack as deletePackCloud,
	getMyPacks as getMyPacksCloud,
	getUser,
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

async function addUsername(user) {
	if (user?.displayName == undefined) {
		return {}
	} else {
		return { username: await getUser(user.uid) }
	}
}

export const useUser = create((set, get) => ({
	user: {},
	setUser: async (newUser) => set({ user: { ...newUser, ...(await addUsername(newUser)) } }),
	// Utility functions
	newPack: (id, newPack) => {
		if (userDefined(get().user)) {
			addNewPackCloud(id, newPack, get().user.username)
		} else {
			addNewPackLocal(id, newPack)
		}
	},
	deletePack: (id) => {
		if (userDefined(get().user)) {
			deletePackCloud(id, get().user.username)
		} else {
			deletePackLocal(id)
		}
	},
	getMyPacks: async () => {
		if (userDefined(get().user)) {
			return await getMyPacksCloud(get().user.username)
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
