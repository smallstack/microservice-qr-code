import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
  {
    ignores: [
      "**/.DS_Store",
      "**/node_modules",
      "**/dist",
      "**/coverage",
      "**/.env",
      "**/.env.*",
      "!**/.env.example",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      quotes: ["warn", "double"],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        // Web/fetch globals available in both the Bunny edge runtime and
        // modern Node (and exercised in vitest tests).
        Request: "readonly",
        Response: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        BodyInit: "readonly",
      },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  {
    // The Bunny Edge entry uses a remote `https://...` import that ESLint
    // can't resolve in a Node context.
    files: ["src/index.ts"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
];
