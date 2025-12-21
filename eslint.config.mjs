import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    languageOptions: { parser: tsParser },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/repository/**"],
              message:
                "Repositories can only be imported by services. Import from @/server/services instead.",
              allowTypeImports: false,
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/server/services/**/*.ts"],
    rules: { "@typescript-eslint/no-restricted-imports": "off" },
  },
]);

export default eslintConfig;
