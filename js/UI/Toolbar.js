import Element from './Element'
import Pane from './Pane'

export default class Toolbar extends Pane {
	constructor(className) {
		super(className)

		let titleInput = new Element('input', `${className}-titleInput`)
		titleInput.el.setAttribute('type', 'text')
		titleInput.el.setAttribute('placeholder', 'Project title...')
		this.add(titleInput)

		let saveButton = new Element('button', `${className}-saveButton`)
		saveButton.el.innerHTML = 'Save'
		this.add(saveButton)
	}
}
