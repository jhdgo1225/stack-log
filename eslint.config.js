import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import prettier from "prettier";
import tseslint from "typescript-eslint";

const prettierConfig = await prettier.resolveConfig(process.cwd());

export default [
  // 전역 무시 설정
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },

  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // TypeScript 권장 규칙 + Parser 적용 (모든 파일 대상 기본값)
  ...tseslint.configs.recommendedTypeChecked, // 타입정보 필요 규칙(프로젝트 인식)
  {
    languageOptions: {
      // TS Parser + 프로젝트 파일 지정
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node, // Node.js 전역 변수 추가
      },
    },
  },

  // 메인 룰셋 (JS/TS/JSX/TSX 공통)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      // typescript-eslint 플러그인은 tseslint.configs에서 이미 로드됨
      prettier: prettierPlugin,
    },

    settings: {
      // import 리졸버: TS(paths), Node, 별칭(@)
      "import/resolver": {
        typescript: {
          // tsconfig의 paths/baseUrl을 읽어 경로 해석
          project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".json"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".json"],
        },
      },
    },

    rules: {
      // React Hooks 권장 규칙
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh 관련
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Import 정렬 및 관리
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",

      // Console 관련
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // 변수 및 코드 품질
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-trailing-spaces": "error",

      // .prettierrc 파일 기반 Prettier 반영
      "prettier/prettier": [
        "error",
        { ...(prettierConfig || {}), endOfLine: "auto" },
      ],
    },
  },

  // JS 전용(비-TS) 파일에서의 규칙
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      // JS에서는 원래 규칙 사용
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "error",
    },
  },

  // TS 전용 파일에서의 규칙 조정
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TS가 대체하므로 끔
      "no-unused-vars": "off",
      "no-undef": "off",

      // TS 버전의 unused-vars 활성화
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // 선택: any 최소화(필요 시 완화 가능)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
