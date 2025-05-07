import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettier,
      vue: vuePlugin
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error', // 移除具体配置，让 ESLint 使用 .prettierrc 的配置
      quotes: 'off', // 关闭 ESLint 自带的引号规则，由 Prettier 处理
      'comma-dangle': 'off', // 关闭 ESLint 自带的尾逗号规则，由 Prettier 处理
      'vue/multi-word-component-names': 'off'
    }
  }
)
