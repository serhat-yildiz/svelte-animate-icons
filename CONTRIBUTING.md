# Contributing to Svelte Animate Icons

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/svelte-animate-icons.git
   cd svelte-animate-icons
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build & Test**
   ```bash
   npm run build
   npm run package
   ```

## 📝 How to Contribute

### 🎨 Adding New Icons

1. Add your SVG icon to `src/lib/icons/`
2. Follow the naming convention: `MyIconName.svelte`
3. Update `src/lib/index.ts` to export the new icon
4. Update `src/lib/registry/iconRegistry.ts` to register the icon

### 🐛 Bug Reports

Please use our [GitHub Issues](https://github.com/serhat-yildiz/svelte-animate-icons/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### 💡 Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Describe the use case
- Explain why it would be valuable

## 🎯 Development Guidelines

### Code Style
- Use TypeScript
- Follow existing patterns
- Add JSDoc comments
- Ensure accessibility

### Icon Requirements
- SVG format only
- 24x24 viewBox (preferred)
- Smooth hover animations
- Web Animations API usage
- Accessible (proper aria-labels)

### Testing
- Test in multiple browsers
- Verify animations work smoothly
- Check bundle size impact

## 📖 Resources

- [Documentation](https://serhat-yildiz.github.io/svelte-animate-icons/docs)
- [Live Demo](https://serhat-yildiz.github.io/svelte-animate-icons/)
- [Svelte 5 Guide](https://svelte.dev/)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

❤️ Thank you for making Svelte Animate Icons better!
