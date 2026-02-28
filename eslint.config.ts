import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

export default tseslint.config(
  // 忽略文件配置
  // ⭐⭐⭐ 第1个配置对象必须是 ignores ⭐⭐⭐
  {
    ignores: [
      // Node.js 相关
      "node_modules/",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lockb",

      // 构建输出
      "dist/",
      "build/",
      "out/",
      "output/",
      "coverage/",

      // 日志文件
      "*.log",
      "logs/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",

      // 运行时文件
      ".env",
      ".env.local",
      ".env.*.local",
      ".env.production",
      ".env.development",

      // IDE 和编辑器
      ".vscode/",
      ".idea/",
      "*.swp",
      "*.swo",
      "*~",

      // 系统文件
      ".DS_Store",
      "Thumbs.db",

      // 测试相关
      "cypress/",
      "test-results/",
      "playwright-report/",
      "__snapshots__/",

      // Vite 缓存
      ".vite/",

      // Git
      ".git/",

      // 其他
      "public/",
      "temp/",
      "tmp/",
      ".temp/",
      ".tmp/",
    ],
  },

  // JavaScript 基础配置
  js.configs.recommended,

  // 全局变量和语言选项
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // TypeScript 配置
  ...tseslint.configs.recommended,

  // Vue 3 配置（使用 flat 配置格式）
  ...vuePlugin.configs["flat/recommended"],

  // 自定义规则配置
  {
    rules: {
      // TypeScript 相关规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Vue 相关规则
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "warn",
      "vue/no-unused-vars": "error",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],

      // 通用 JavaScript 规则
      "no-console":
        process.env.NODE_ENV === "production"
          ? ["warn", { allow: ["warn", "error"] }]
          : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-alert": "warn",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      quotes: ["error", "double", { avoidEscape: true }], // single 引号在 jsx 中会报错
      semi: ["error", "always"],
      // "comma-dangle": ["error", "never"], // 禁用逗号结尾, 比如错误示例：obj = { a: 1, b: 2, }
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
          MemberExpression: 1,
          ignoredNodes: ["TemplateLiteral *"],
        },
      ],
    },
  },

  // Vue 文件特定配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
  },

  // TypeScript 文件特定配置
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["eslint.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
);
