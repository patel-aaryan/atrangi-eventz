import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "migrations/**/*.js",
      "scripts/**/*.js",
    ],
  },
  {
    rules: {
      "no-restricted-imports": [
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
    // Allow repository imports only in services directory
    files: ["src/server/services/**/*.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
