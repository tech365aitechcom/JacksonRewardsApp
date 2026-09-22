import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**", "out/**", "node_modules/**", "android/**", "release/**",
      "public/**", ".claude/**", ".codex/**", ".agents/**",
      "ALTERNATIVE_UPDATE_METHOD.js", "UPDATED_BIOMETRIC_SCHEMA.js",
      "routes/biometric-fixed.js",
      "app/(onboarding)/select-age/draft.jsx",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
