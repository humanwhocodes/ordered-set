module.exports = {
    "env": {
        "es6": true,
        commonjs: true,
        node: true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    overrides: [
        {
            files: ["tests/*.js"],
            env: {
                mocha: true
            }
        }
    ]
};