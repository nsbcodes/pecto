import { create } from 'zustand'
import produce from 'immer'

import { v4 as uuidv4 } from 'uuid'

export const usePack = create((set) => ({
	pack: {},
	canEdit: false,
	// Cards
	// eslint-disable-next-line no-unused-vars
	loadPack: (pack) => set(() => ({ pack: pack })),
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
	addQuizletCards: (quizletContents) =>
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
						category: 'Default',
					})
				})

				// Remove the last (empty) element
				cards.pop()

				state.pack.content = cards
			})
		),
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
	addCategory: (newCategory, newColor) =>
		set(
			produce((state) => {
				state.pack.categories[uuidv4()] = { name: newCategory, colors: newColor }
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
	removeCardCategory: (id) =>
		set(
			produce((state) => {
				state.pack.content.forEach((e, i) => {
					if (state.pack.content[i].category == id) {
						state.pack.content[i].category = 'default'
					}
				})
				delete state.pack.categories[id]
			})
		),
	// Editor
	letMeEdit: (val) => set({ canEdit: val }),
}))
