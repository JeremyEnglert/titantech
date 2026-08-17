import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// eslint-config-next 16 ships native flat configs. The starter still routed
// them through `FlatCompat`, which serializes the config to JSON to validate
// it — and the React plugin holds a circular reference, so every lint run died
// with "Converting circular structure to JSON" before reading a single file.
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'src/app/(payload)/admin/importMap.js', 'design/**'],
  },
]

export default eslintConfig
