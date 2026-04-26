import nextPlugin from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextPlugin,
  {
    rules: {
      // New in Next.js 16 / eslint-config-next@16 with React Compiler rules.
      // These flag pre-existing patterns that should be refactored separately.
      // Downgraded to warnings to avoid blocking CI while code is gradually improved.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];

export default config;
