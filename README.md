# Professional Registration System

This project is a professional registration system built with React, TypeScript, and Vite.

## Features
- **Landing Page:** CAPTCHA puzzle to verify users are not bots.
- **Registration/Sign-In:** Gmail-style UI for a familiar and professional experience.
- **Modern UI:** Responsive, accessible, and clean design.
- **Smooth Flow:** Seamless navigation and transitions.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `src/components/CaptchaPage.tsx`: CAPTCHA puzzle landing page.
- `src/components/RegistrationPage.tsx`: Gmail-style registration/sign-in page.
- `src/App.tsx`: Main app and routing.

## Customization
You can update the puzzle logic, UI styles, and authentication flow as needed.

## License
MIT
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
