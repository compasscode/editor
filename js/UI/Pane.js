import Element from './Element'

export default class Pane extends Element {
	// A Pane is a simple container for any other UI
	// elements. It's basically a <div>.
	constructor(className) {
		super('div', className)
		this.el.classList.add('pane')
	}

	// You can set a bunch of panes to be resizable
	// using split(panes, opts). Options are passed
	// directly to Split.js.
	static split(panes, opts) {
		const Split = require('split.js')
		return Split(panes.map(pane => pane.el), opts)
	}
}
