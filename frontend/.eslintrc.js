module.exports = {
	root: true,
	ignorePatterns: [
		"projects/**/*",
		"dist",
		"src/environments",
		"**/index.html"
	],
	overrides: [
		{
			files: ["*.ts"],
			parserOptions: {
				project: ["tsconfig.json", "e2e/tsconfig.json"],
				tsconfigRootDir: __dirname,
				createDefaultProgram: true
			},
			extends: [
				"airbnb-typescript/base",
				"plugin:@angular-eslint/recommended",
				"plugin:@angular-eslint/template/process-inline-templates",
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended"
			],
			plugins: ["import"],
			rules: {
				"@angular-eslint/component-selector": [
					"error",
					{
						type: "element",
						prefix: "app",
						style: "kebab-case"
					}
				],
				"@angular-eslint/directive-selector": [
					"error",
					{
						type: "attribute",
						prefix: "app",
						style: "camelCase"
					}
				],
				"import/prefer-default-export": "off",
				"class-methods-use-this": "off",
				"no-console": ["warn"],
				"no-explicit-any": "off",
				"linebreak-style": ["error", "windows"],
				"lines-between-class-members": "off",
				"@typescript-eslint/lines-between-class-members": [
					"error",
					"always",
					{ exceptAfterSingleLine: true }
				],
				"no-plusplus": "off",
				"max-len": ["error", 200],
				"comma-dangle": "off",
				"@typescript-eslint/comma-dangle": ["off"],
				indent: "off",
				"@typescript-eslint/indent": ["error", "tab"],
				"arrow-spacing": ["error", { before: true, after: true }],
				'@typescript-eslint/adjacent-overload-signatures': 'off',
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-loop-func": "off",
				"@typescript-eslint/dot-notation": "off",
				"no-prototype-builtins": "off",
			}
		},
		{
			files: ["*.html"],
			extends: [
				"plugin:@angular-eslint/template/recommended",
				"plugin:prettier/recommended"
			],
			rules: {
				"prettier/prettier": [
					"error",
					{
						tabWidth: 2,
						printWidth: 150
					}
				]
			}
		}
	]
};
