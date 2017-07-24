import Element from './Element'
import Pane from './Pane'

export default class Nav extends Pane {
	constructor(className) {
		super(className)

		let logo = new Element('div', `${className}-logo`)
		this.add(logo)

		let links = [
			{ title: 'Home', url: '#' },
			{ title: 'Projects', url: '#' },
			{ title: 'Forums', url: '#' },
			{ title: 'About', url: '#' },
		]
		links.map((linkObj) => {
			let link = new Element('a', `${className}-link`)
			link.el.innerHTML = linkObj.title
			link.el.setAttribute('href', linkObj.url)

			this.add(link)
		})

		let user = new Element('div', `${className}-user`)
		this.add(user)
	}
}
