const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


var config = {
	mode : 'development',
	entry : {
		style : './public/js/styling.js'
	},
	watch : true,
	output : {
		path : path.resolve(__dirname , 'dist'),
		filename : '[name].bundle.js',
	},
	module : {
		rules : [
			{
				test : /\.scss$/,
				use: [
	                {loader : "style-loader"}, // creates style nodes from JS strings
	                {loader : "css-loader"}, // translates CSS into CommonJS
	                {loader : "sass-loader", // compiles Sass to CSS
		            	options: {
		   					 includePaths: ['./node_modules']
		  				}
	  				}
            	],
			},
		]
	},
	plugins: [
			new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			files : ['./public/css/*.css', './views/*.hbs', './views/**/*', './*.html', './routes/*.js', './server.js' , './public/js/*.js'],
			// tunnel : true,
			proxy : 'http://localhost:8080/'
    	}),
	],
	node : {
		fs : 'empty'
	}
}

module.exports = config;