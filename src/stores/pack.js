import { create } from 'zustand'
import produce from 'immer'

import { v4 as uuidv4 } from 'uuid'

import { levenSort } from '@/lib/utilities'

import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

import { db as localDb } from '@/lib/localstore'

// import { mountStoreDevtool } from 'simple-zustand-devtools'

export const usePack = create((set, get) => ({
	defaultPack: undefined,
	pack: undefined,
	error: false,
	loading: true,
	canEdit: false,
	loadPack: async (user, id) => {
		if (user == 'me') {
			let ref = await localDb.packs.get(id)
			if (ref === undefined) {
				set({ pack: undefined, error: true, loading: false })
			} else {
				set({ defaultPack: ref, pack: ref, error: false, loading: false })
			}
		} else {
			var ref
			try {
				ref = await getDoc(doc(db, 'packs', user, 'packs', id))
			} catch (e) {
				set({ pack: undefined, error: e, loading: false })
				return
			}
			if (!ref.exists()) {
				set({ pack: undefined, error: true, loading: false })
			} else {
				set({ defaultPack: ref.data(), pack: ref.data(), error: false, loading: false })
			}
		}
		set({ loading: false })
	},
	filterPackCategory: (category) => {
		if (category == 0) {
			set({ pack: get().defaultPack })
		} else {
			set({
				pack: {
					...get().defaultPack,
					content: get().defaultPack.content.filter((c) => c.category == category),
				},
			})
		}
	},
	addCards: (cards) =>
		set(
			produce((state) => {
				state.pack.content.push(cards)
			})
		),
	setCard: (i, newCard) =>
		set(
			produce((state) => {
				state.pack.content[i] = { ...state.pack.content[i], ...newCard }
			})
		),
	deleteCard: (i) =>
		set(
			produce((state) => {
				state.pack.content.splice(i, 1)
			})
		),
	// Utility
	addQuizletCards: (quizletContents, category = 'default') =>
		set(
			produce((state) => {
				let cards = []
				// Split pack into cards
				const arr = quizletContents.split('⭕')
				arr.forEach((e) => {
					// Split cards into term/defintion
					let a = e.split('🟢')
					cards.push({
						term: a[0],
						definition: a[1],
						category: category,
						uuid: uuidv4(),
					})
				})

				// Remove the last (empty) element
				cards.pop()

				// Add the cards to the pack
				state.pack.content = state.pack.content.concat(cards)
			})
		),
	getSimilarCards: (card) => {
		let p = get().pack.content

		// Get the index of the card we want to use as a base
		let i = p.findIndex((c) => c === card)
		console.log(i)

		// Sort using the Levenshtein algorithm
		p = levenSort(p, i)

		// Only use the first 4 elements
		p = p.slice(0, 4)

		// Randomize it!
		p.sort(() => 0.5 - Math.random())

		return p
	},
	// Metadata
	editClass: (newClass) =>
		set(
			produce((state) => {
				state.pack.class = newClass
			})
		),
	editName: (newName) =>
		set(
			produce((state) => {
				state.pack.name = newName
			})
		),
	togglePublish: (val) =>
		set(
			produce((state) => {
				state.pack.published = val
			})
		),
	// Categories
	addCategory: (newCategory, newColor, uuid = uuidv4()) =>
		set(
			produce((state) => {
				state.pack.categories[uuid] = { name: newCategory, colors: newColor }
			})
		),
	addPicture: (picture) =>
		set(
			produce((state) => {
				state.pack.pictures.push(picture)
			})
		),
	editCategory: (id, newCategory) =>
		set(
			produce((state) => {
				state.pack.categories[id] = { ...state.pack.categories[id], ...newCategory }
			})
		),
	setCardCategory: (i, categoryId) =>
		set(
			produce((state) => {
				state.pack.content[i]['category'] = categoryId
			})
		),
	setCardPicture: (i, pictureURL) => {
		set(
			produce((state) => {
				state.pack.content[i]['picture'] = pictureURL
			})
		)
	},
	removeCardCategory: (id) =>
		set(
			produce((state) => {
				state.pack.content.forEach((_e, i) => {
					if (state.pack.content[i].category == id) {
						state.pack.content[i].category = 'default'
					}
				})
				delete state.pack.categories[id]
			})
		),
	removeCardPicture: (i) => {
		set(
			produce((state) => {
				delete state.pack.content[i].picture
			})
		)
	},
	// Editor
	letMeEdit: (val) => set({ canEdit: val }),
}))

// if (import.meta.env.DEV) {
// 	mountStoreDevtool('Pack', usePack)
// }
