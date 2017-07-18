import 'babel-polyfill'
require('web-animations-js')

import Element from './UI/Element'
import Pane from './UI/Pane'
import Codearea from './UI/Codearea'

const editor = new Pane('editor f--row')
const leftPane = new Pane('pane--left f-g2 f--col')
const rightPane = new Pane('pane--right f-g3')

// Add the output iframe to the right pane
let iframe = editor.outputFrame = new Element('iframe', 'iframe--output')
iframe.el.setAttribute('sandbox', 'allow-modals allow-scripts allow-same-origin')
iframe.el.src = 'about:blank'
rightPane.add(iframe)

// Add code panes to the left pane
let langs = [ 'html', 'css', 'js' ]
let langpanes = langs.map(lang => {
	let pane = new Pane(`pane--lang pane--lang-${lang} f-g1`)
	let codearea = new Codearea(lang, iframe)

	leftPane.add(pane.add(codearea))
	return pane
})

Pane.split(langpanes, {
	minSize: 24,
	gutterSize: 8,
	snapOffset: 0,
	direction: 'vertical',
	cursor: 'row-resize',
})

// Add the editor to the body
document.body.appendChild(editor.add(leftPane).add(rightPane).el)

// Reveal the editor underneath the
// loader, then remove the loader.
// Pretty animation included.
let anim = document.querySelector('.loader').animate([
  { transform: 'translateY(0)' },
	{ transform: `translateY(100%)` },
], {
	duration: 500,
	delay: 100,
	fill: 'forwards',
	easing: 'ease-in-out',
})

anim.onfinish = () => document.querySelector('.loader').remove()
