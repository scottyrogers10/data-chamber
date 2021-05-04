module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname + "/dist",
		publicPath: "/",
		filename: "bundle.js",
		library: "DataChamber",
		libraryTarget: "umd",
	},
	target: "web",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	resolve: {
		extensions: ["*", ".js"],
	},
	// devtool: "inline-source-map",
};
