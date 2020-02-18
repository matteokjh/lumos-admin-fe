const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require('path')
const resolvePath = (dir) => {
    return path.join(__dirname, dir)
}

module.exports = function override(config, env) {
    config.resolve.alias = {
        '@': resolvePath('src')
    }
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: [
                "json",
                "javascript",
                "typescript",
                "cpp",
                "java",
                "python",
                "markdown",
                "css",
                "html",
                "scss"
            ]
        })
    );
    return config;
};
