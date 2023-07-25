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

export const useIntervals = create((set, get) => ({
	intervals: getIntervals(),
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

		let intervals = {}

		// Fill in the intervals array
		for (let i = 1; i <= cycles; i++) {
			intervals[i] = [{ box: 0 }]
		}

		raw.forEach((v, _i) => {
			for (let i = 1; i <= Math.floor(1 / v); i++) {
				let index = Math.round(v * i * cycles)
				// Ignore duplicates
				if (!intervals[index].find((val) => val.box == _i)) {
					intervals[index] = [...intervals[index], { box: _i }]
				}
			}
		})

		// Fill in the first box
		intervals[1][0] = { box: 0, content: content }

		intervals = { max: raw.length - 1, intervals: intervals }
		saveIntervals(intervals)
		set({ intervals: intervals })
	},
	advanceCard: (card, index, subindex, advanceTo) => {
		let intervals = get().intervals
		let possible = false
		const arr = Object.values(intervals.intervals)

		// arr.slice(index, arr.length - 1).forEach((val, i) => {
		// 	val.slice(subindex, val.length - 1).forEach((v, i_2) => {
		// 		if (v.box == advanceTo) {
		// 			intervals.intervals[index + i][subindex + i_2].content = [
		// 				...(v?.content || []),
		// 				card,
		// 			]
		// 			possible = true
		// 			console.log('ran')
		// 			return
		// 		}
		// 	})
		// })

		function loop() {
			// dict starting at 1 -> array
			for (let i = index - 1; i < arr.length; i++) {
				for (let i_2 = subindex; i_2 < arr[i].length; i_2++) {
					console.log(i, i_2, arr[i][i_2])
					if (arr[i][i_2].box == advanceTo) {
						intervals.intervals[i + 1][i_2].content = [
							...(arr[i][i_2].content || []),
							card,
						]
						possible = true
						return
					}
				}
			}
		}

		loop()

		if (possible) {
			intervals.intervals[index][subindex].content = intervals.intervals[index][
				subindex
			].content.filter((item) => item !== card)
		}

		saveIntervals(intervals)
		set({ intervals: intervals })

		console.log(intervals)

		return possible
	},
}))
