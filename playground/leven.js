import leven from 'leven'

var a = ['stink', 'poshit', 'stinker', 'stinka', 'gobar']
var baseIndex = 2
console.log(a)

// MUTATE

var levenArr = []
a.forEach((e, i) => (levenArr[i] = { element: e, leven: leven(a[baseIndex], e) }))

levenArr.sort((a, b) => {
	if (a.leven < b.leven) {
		return -1
	}
	if (a.leven > b.leven) {
		return 1
	}
	return 0
})
a = []
levenArr.forEach((e, i) => (a[i] = e.element))

console.log(a)
