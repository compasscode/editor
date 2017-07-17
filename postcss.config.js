module.exports = ({ env }) => {
	if (env === 'production') {
		return {
			plugins: {
				'postcss-import': {},
				'postcss-cssnext': {
					browsers: '> 1%, last 4 versions',
					compress: true,
				},
				'cssnano': { autoprefixer: false },
			},
			map: false,
		}
	} else {
		return { plugins: {
			'postcss-import': {},
			'postcss-cssnext': {
				// only support the latest Chrome/FF versions
				browsers: 'last 1 Chrome versions, Firefox ESR',
			},
			// don't minify
		}}
	}
}
