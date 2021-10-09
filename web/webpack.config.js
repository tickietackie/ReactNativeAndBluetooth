const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// const rootDir = path.join(__dirname, '..');
const webpackEnv = process.env.NODE_ENV || "development";

const rootDir = path.resolve(__dirname, "../");

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
    test: /\.(js)?$/,
    // Add every directory that needs to be compiled by Babel during the build.
    include: [
        path.resolve(rootDir, "index.js"),
        path.resolve(rootDir, "src"),
        path.resolve(rootDir, "node_modules"),
        path.resolve(rootDir, "node_modules/react-native-uncompiled"),
        path.resolve(rootDir, "node_modules/react-native-sdk")
    ],
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: true,
            // The 'react-native' preset is recommended to match React Native's packager
            // presets: ['module:metro-react-native-babel-preset'],
            // presets: ['react-native'],
            presets: ["@babel/preset-flow"]
            // presets: [require.resolve("babel-preset-react-native")]
            // Re-write paths to import only the modules needed by the app
            // plugins: ['react-native-web',],
            // presets: ["react-native"]
            // presets: ["module:babel-preset-react-native"]
            // plugins: [
            //   // needed to support async/await
            //   '@babel/plugin-transform-runtime'
            // ]
        }
    }
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: "url-loader",
        options: {
            name: "[name].[ext]"
        }
    }
};

module.exports = {
    mode: webpackEnv,
    entry: {
        app: path.join(rootDir, "./index.web.ts")
    },
    output: {
        path: path.resolve(rootDir, "dist"),
        filename: "app-[hash].bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            imageLoaderConfiguration,
            babelLoaderConfiguration,
            {
                test: /\.(ts|tsx)?$/, loader: "ts-loader", exclude: /node_modules/

            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./index.html")
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [
            ".web.tsx",
            ".web.ts",
            ".tsx",
            ".ts",
            ".web.jsx",
            ".web.js",
            ".jsx",
            ".js"
        ], // read files in fillowing order
        alias: { "react-native$": "react-native-web" }
    },
    devServer: {
        https: true
    }

};
