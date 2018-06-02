const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


var config = {
	mode : 'development',
	// entry : {
	// 	app : './app.js'
	// },
	watch : true,
	// output : {
	// 	path : path.resolve(__dirname , 'dist'),
	// 	filename : '[name].bundle.js',
	// },
	module : {
		rules : [
			{
				test : /\.css$/,
				loader : 'style-loader!css-loader'
			},
			{
				test : /\.js$/,
				exclude : /(node_modules|bower_components)/,
				use : {
					loader : 'babel-loader',
					options : {
						presets : ['es2015', 'env']
					}
				},
			}
		]
	},
	plugins: [
			new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			files : ['./public/css/*.css', './views/*.hbs', './views/**/*', './*.html', './routes/*.js', './server.js' , './public/js/*.js'],
			// tunnel : true,
			proxy : 'http://localhost:8001/'
    	}),
	],
	node : {
		fs : 'empty'
	}
}

module.exports = config;