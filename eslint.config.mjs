import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "warn",

      ],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
  },
];
