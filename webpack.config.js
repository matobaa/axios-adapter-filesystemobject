
module.exports = {
    output: {
        filename: 'fso-adapter.js',
        library: ['axios','fsoAdapter'],
        libraryTarget: 'umd'
    },
    externals: [
        'axios',
    ]
}