export default class Element {
	// An Element is a wrapper around window.Element.
	// It implements a bunch of helper methods, and
	// is intended to be extended upon.
	constructor(type = 'div', className = '') {
		this.el = document.createElement(type)
		this.el.className = className
		this.parent = null
	}

	add(el) {
		if (!(el instanceof Element))
			throw new TypeError('Element.add: el must be Element')

		el.parent = this
		this.el.appendChild(el.el)
	}
}
