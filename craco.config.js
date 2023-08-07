const path = require('path')

// someday, clean up the the FOUR! repeated declarations of aliases (others are is in tsconfig.paths.json => tsconfig.json and .storybook/main.ts)
// https://stackoverflow.com/a/71892901

module.exports = {
  webpack: {
    eslint: {
      enable: false
    },
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@Components': path.resolve(__dirname, 'src/Components'),
      '@State': path.resolve(__dirname, 'src/State')
    },
    configure: {
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          https: false,
          http: false,
          path: false,
          zlib: false
        }
      }
    }
  },
  jest: {
    configure: {
      verbose: true,
      moduleNameMapper: {
        '^@Components/(.*)$': '<rootDir>/src/Components/$1',
        '^@State/(.*)$': '<rootDir>/src/State/$1'
      }
    }
  },
  plugins: []
}
