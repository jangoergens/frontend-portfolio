import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "**/node_modules/**",
    "**/.astro/**",
    "**/.svelte-kit/**",
    "**/build/**",
    "**/dist/**",
    "**/.vercel/**",
    "**/.turbo/**",
    "**/test-results/**",
    "**/playwright-report/**",
  ]),
  js.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["apps/**/*.{ts,svelte}"],
    extends: [ts.configs.recommended],
  },
  ...["personal-website", "top-comment-finder"].map((app) => ({
    files: [`apps/${app}/{src,tests}/**/*.{ts,svelte}`],
    extends: [ts.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: [`./apps/${app}/tsconfig.json`],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".svelte"],
      },
    },
  })),
  svelte.configs.recommended,
  {
    files: ["apps/**/*.svelte"],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
  {
    files: ["apps/*/src/**/*.{ts,svelte}", "apps/*/tests/**/*.ts"],
    extends: [perfectionist.configs["recommended-natural"]],
  },
  {
    files: ["apps/tcf-chrome-extension/background.js"],
    languageOptions: { globals: globals.webextensions },
  },
  prettier,
);
