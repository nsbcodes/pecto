const BasePack = () => {
	return {
		name: '',
		class: '',
		author: 'me',
		superficialAuthor: 'Me (Locally Saved)',
		date: new Date(Date.now()).toLocaleString().split(',')[0],
		uid: null, // Must be defined when imported to Firestore
		uuid: '',
		published: false,
		categories: {
			// id (key) on new categories should be something generated with uuidV4
			default: { name: 'Default', colors: ['transparent', 'transparent'] },
		},
		content: [
			{
				term: '',
				definition: '',
				category: 'default',
			},
		],
	}
}

export { BasePack }
console.log(Object.keys(BasePack()).join(','))