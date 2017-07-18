import Element from './Element'
import Pane from './Pane'

export default class Toolbar extends Pane {
	constructor(className) {
		super(className)

		let logo = new Element('div', 'toolbar-logo')
		let titleInput = new Element('input', 'toolbar-titleInput')
		let saveButton = new Element('button', 'toolbar-saveButton')
		let shareButton = new Element('button', 'toolbar-shareButton')
		let user = new Element('div', 'toolbar-user')
		
		saveButton.el.innerHTML = 'Save'
		shareButton.el.innerHTML = 'Share'
		titleInput.el.placeholder = 'Project title'
		
		this.add(logo)
			.add(titleInput)
			.add(saveButton)
			.add(shareButton)
			.add(user)
	}
}
