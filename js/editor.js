import 'babel-polyfill'
import 'web-animations-js'
import Pane, { ResizablePane } from './UI/Pane'

// DOM is loaded; let's build the app!
const editor = new Pane('editor')
console.log(editor)

// Add the editor Pane to the body
document.body.appendChild(editor.el)

// Reveal the editor underneath the
// loader, then remove the loader.
// Pretty animation included.
let anim = document.querySelector('.loader').animate([
  { transform: 'translateY(0)' },
	{ transform: `translateY(100%)` },
], {
	duration: 1000,
	delay: 250,
	fill: 'forwards',
	easing: 'ease-in',
})

anim.onfinish = () => document.querySelector('.loader').remove()
