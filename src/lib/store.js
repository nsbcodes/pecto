import {
	addNewPack as addNewPackCloud,
	deletePack as deletePackCloud,
	getMyPacks as getMyPacksCloud,
} from './firebase'
import {
	addNewPack as addNewPackLocal,
	deletePack as deletePackLocal,
	getMyPacks as getMyPacksLocal
} from './localstore'
import { getAuth } from 'firebase/auth'

// We really don't need this as a class,
// just in-case we can't use getAuth this exists

// Ideally we should do this (singleton):
// static getInstance() {
// 	if (!Life.instance) {
// 		Life.instance = new Life();
// 	}
// 	return Life.instance;

// }
// ...
// Life.instance = null
// https://www.dofactory.com/javascript/design-patterns/singleton

class Store {
    constructor(isAuth) {
        this.authenticated = isAuth
    }

    // get authenticated() {
    //     return this._authenticated
    // }

	newPack(id, newPack) {
		if (this._authenticated) {
			addNewPackCloud(id, newPack)
		} else {
			addNewPackLocal(id, newPack)
		}
	}

	deletePack(id) {
		if (this._authenticated) {
			deletePackCloud(id)
		} else {
			deletePackLocal(id)
		}
	}

	getMyPacks() {
		if (this._authenticated) {
			return getMyPacksCloud()
		} else {
			return getMyPacksLocal()
		}
	}

    set authenticated(isAuth) {
        this._authenticated = isAuth
    }
}

const StoreInstance = new Store(getAuth().CurrentUser)

export { StoreInstance }