//https://github.com/typescript-eslint/typescript-eslint/issues/101#issuecomment-499303058
module.exports = {
    extends: "../.eslintrc-base.json",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    }
};
