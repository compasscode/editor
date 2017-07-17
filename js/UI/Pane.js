import Element from './Element'

export default class Pane extends Element {
	// A Pane is a simple container for any other UI
	// elements. It's basically a <div>.
	constructor(className) {
		super('div', className)
		this.el.classList.add('pane')
	}
}

export class ResizablePane extends Pane {
	// A ResizablePane is a pane that is resizable,
	// from north-to-south, from east-to-west, or
	// simply in all directions.

	static get NORTH_SOUTH() { return Symbol('NS')  }
	static get EAST_WEST()   { return Symbol('EW')  }
	static get ALL_AROUND()  { return Symbol('ALL_AROUND') }

	constructor(className, direction = ResizablePane.ALL_AROUND) {
		super(className)
		this.el.classList.add('pane--resizable')

		if ([ ResizablePane.NORTH_SOUTH, ResizablePane.EAST_WEST,
		      ResizablePane.ALL_AROUND ].includes(direction))
			this.resizeDirection = direction
		else
			throw new TypeError('ResizablePane: direction must be NORTH_SOUTH, '
			                  + 'EAST_WEST, or ALL_AROUND')
	}
}
