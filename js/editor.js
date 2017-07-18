import 'babel-polyfill'
require('web-animations-js')

import Element from './UI/Element'
import Pane from './UI/Pane'
import Codearea from './UI/Codearea'
import Toolbar from './UI/Toolbar'

const toolbar = new Toolbar('toolbar')

const page = new Pane('page')
const help = new Pane('help')
const editors = new Pane('editors')
const output = new Pane('output')
page.add(help).add(editors).add(output)

// Add the output iframe to the right pane
let iframe = new Element('iframe', 'iframe--output')
iframe.el.setAttribute('sandbox', 'allow-modals allow-scripts allow-same-origin')
iframe.el.src = 'about:blank'
output.add(iframe)

// Add code panes to the left pane
let langs = [ 'html', 'css', 'js' ]
let langpanes = langs.map(lang => {
	let pane = new Pane(`pane--lang pane--lang-${lang} f-g1`)
	let codearea = new Codearea(lang, iframe)

	editors.add(pane.add(codearea))
	return pane
})

Pane.split(langpanes, {
	minSize: 24, // BUG: minSize doesn't do anything (here or below)
	gutterSize: 8,
	snapOffset: 0,
	direction: 'vertical',
	cursor: 'row-resize',
})
Pane.split([editors, output], {
	gutterSize: 8,
	minSize: 100,
	snapOffset: 0
})

document.body.appendChild(toolbar.el)
document.body.appendChild(page.el)


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
