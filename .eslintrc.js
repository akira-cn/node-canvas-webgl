const packageConfig = require('./package.json');

function toCamelCase(str) {
  return str.replace(/-([a-z])/ig, (str, p1) => p1.toUpperCase());
}

const libName = toCamelCase(packageConfig.name);

module.exports = {
  globals: {
    [libName]: libName,
  },
  extends:  "eslint-config-sprite",
  plugins: ['html'],
  rules: {
    "complexity": ["warn", 25],
    'import/prefer-default-export': 'off',
    "no-unused-vars": 'warn',
  },
}
