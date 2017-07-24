import Element from './Element'

export default class Codearea extends Element {
	// TODO use codemirror rather than a <textarea>

	constructor(lang, frame) {
		super('textarea', 'codearea')

		console.log(frame)

		this.lang = lang
		this.outputFrame = frame
		this.el.setAttribute('placeholder', lang) // XXX

		// FIXME: this will probably slow down the browser a lot!
		//        using codemirror's event system should fix this.
		this.el.addEventListener('keyup', () => this.update())
	}

	update() {
		console.log(this.outputFrame)
		if (!this.outputFrame || !(this.outputFrame instanceof Element))
			throw new TypeError('Codearea.update: outputFrame invalid or undefined')

		console.log(this.outputFrame.el)
		const win = this.outputFrame.el.contentWindow
		const doc = win.document
		const code = this.el.value

		switch (this.lang) {
			case 'html':
				doc.body.innerHTML = code
				break
			case 'css':
				doc.head.innerHTML = `<style>${code}</style>`
				break
			case 'js':
				// TODO
				break
			default:
				throw new TypeError()
		}
	}
}
