import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  "plugin:@typescript-eslint/recommended",
  "prettier",
  {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreIIFE: true, ignoreVoid: true },
      ],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "_", varsIgnorePattern: "_" },
      ],
    },
    files: ["**/*.js", "**/*.ts"],
  },
];
