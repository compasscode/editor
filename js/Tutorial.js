const marked = require('marked')
const lexer = new marked.Lexer({
  gfm: true,
  tables: false,
  smartypants: true,
})

module.exports = class Tutorial {
  constructor(ast) {
    // ast -> Tutorial
    this.ast = ast
  }
  
  static from(markdown) {
    // markdown source -> Tutorial
    return new Tutorial(lexer.lex(markdown))
  }

  render() {
    // -> html
    let html = ''
    
    for (let node of this.ast) {
      switch (node.type) {
        case 'code': {
          if (node.lang === 'actualcss' || node.lang === 'actualhtml' || node.lang === 'actualjs')
            return `<script>function ${node.lang}(vars) { return ${JSON.stringify(node.source)} }</script>`
          else {
            // TODO codeblock with editable sections marked with [$var] and variables marked with <$var>
            throw new TypeError
          }
        }

        // TODO other nodes. see marked.Renderer

        default:
          throw new TypeError('Tutorial: unknown ast node ' + node.type)
      }
    }

    return html
  }
}

