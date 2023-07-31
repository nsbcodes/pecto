import { create } from 'zustand'

// see: https://www.desmos.com/calculator/qp5yg2cest
// exponentially decreases before linearly converging to 0
export const cycleModifier = function (x, b = 1, a = 0.75, base = 60) {
	return ((base / x) ^ a) * b
}

const saveIntervals = function (val) {
	localStorage.setItem('intervals', JSON.stringify(val))
}

const getIntervals = function () {
	return JSON.parse(localStorage.getItem('intervals'))
}

const saveBoxes = function (val) {
	localStorage.setItem('boxes', JSON.stringify(val))
}

const getBoxes = function () {
	return JSON.parse(localStorage.getItem('boxes'))
}

export const useIntervals = create((set, get) => ({
	intervals: getIntervals(),
	boxes: getBoxes(),
	// Utility functions
	generateIntervals: (cycles, content) => {
		cycles = cycles * cycleModifier(content.length)
		let raw = []
		let i_2 = 2
		for (let i = cycles; i > 0; i--) {
			let x = i / i_2
			raw.push(x < 1 ? Math.ceil(x) : x)
			i_2++
		}
		raw.sort((a, b) => a - b)
		raw = [...new Set(raw)]

		const ratio = Math.max(...raw) / 50

		raw = raw.map((v) => Math.round(v / ratio) / 100)

		let intervals = []

		raw.forEach((v, _i) => {
			for (let i = 1; i <= Math.floor(1 / v); i++) {
				let index = Math.round(v * i * cycles)
				intervals.push({ box: _i, day: index })
			}
		})

		// Sort the intervals by day ascending
		intervals.sort((a, b) => a.day - b.day)

		saveIntervals(intervals)
		set({ intervals: intervals })

		console.log(intervals)

		// Generate boxes
		let uniqueBoxes = [...new Set(intervals.map((v) => v.box))]
		let boxes = {}
		uniqueBoxes.forEach((v) => {
			boxes[v] = []
		})

		// Fill in the first box
		boxes[0] = content

		saveBoxes(boxes)
		set({ boxes: boxes })

		console.log(boxes)
	},
	advanceCard: (box, contentIndex) => {
		let boxes = get().boxes

		// Delete the card from the current box (object not array)
		console.log(boxes[box], contentIndex)
		boxes[box].splice(contentIndex, 1)

		// Get the next box
		let nextBox = Object.keys(boxes).indexOf(box.toString()) + 1

		// Add the card to the next box
		boxes[nextBox] = [boxes[box][contentIndex], ...boxes[nextBox]]

		// saveBoxes(boxes)
		// set({ boxes: boxes })
	},
	// advanceCard: (card, index, subindex, advanceTo) => {
	// 	let intervals = get().intervals
	// 	console.log(intervals)
	// 	let possible = false
	// 	const arr = Object.values(intervals.intervals)

	// 	// arr.slice(index, arr.length - 1).forEach((val, i) => {
	// 	// 	val.slice(subindex, val.length - 1).forEach((v, i_2) => {
	// 	// 		if (v.box == advanceTo) {
	// 	// 			intervals.intervals[index + i][subindex + i_2].content = [
	// 	// 				...(v?.content || []),
	// 	// 				card,
	// 	// 			]
	// 	// 			possible = true
	// 	// 			console.log('ran')
	// 	// 			return
	// 	// 		}
	// 	// 	})
	// 	// })

	// 	function loop() {
	// 		// dict starting at 1 -> array
	// 		for (let i = index - 1; i < arr.length; i++) {
	// 			for (let i_2 = subindex; i_2 < arr[i].length; i_2++) {
	// 				if (arr[i][i_2].box == advanceTo) {
	// 					intervals.intervals[i + 1][i_2].content = [
	// 						...(arr[i][i_2].content || []),
	// 						card,
	// 					]
	// 					possible = true
	// 					return
	// 				}
	// 			}
	// 		}
	// 	}

	// 	loop()

	// 	if (possible) {
	// 		intervals.intervals[index][subindex].content = intervals.intervals[index][
	// 			subindex
	// 		].content.filter((item) => item !== card)
	// 	}

	// 	saveIntervals(intervals)
	// 	set({ intervals: intervals })

	// 	console.log(intervals)

	// 	return possible
	// },
}))
