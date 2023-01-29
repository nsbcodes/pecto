import { v4 as uuidv4 } from 'uuid'

const BasePack = () => {
	return {
		name: '',
		class: '',
		author: 'Me (not logged in)',
		date: new Date(Date.now()).toLocaleString().split(',')[0],
		uid: null, // Must be defined when imported to Firestore
		uuid: uuidv4(),
		published: false,
		categories: {'Default': ['transparent', 'transparent']},
		content: [
			{
				term: '',
				definition: '',
				category: 'Default'
			},
		],
	}
}

export { BasePack }