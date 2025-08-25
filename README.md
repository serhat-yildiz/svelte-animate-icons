# 🎨 Svelte Animate Icons

> Beautiful, performant animated SVG icons built specifically for Svelte 5 with runes

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5.0-ff3e00.svg)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- 🚀 **Built for Svelte 5** - Leverages the new runes system (`$state`, `$derived`, `$effect`)
- ⚡ **High Performance** - Uses native Web Animations API instead of heavy frameworks
- 📦 **Lightweight** - ~80% smaller bundle size compared to React alternatives
- 🎯 **Developer Friendly** - Copy-paste ready code with multiple import options
- 📱 **Mobile First** - Touch-optimized and responsive design
- 🎨 **Professional UI** - Modern Svelte-inspired design language
- 🔧 **TypeScript** - Full type safety and IntelliSense support

## 🎯 Performance Goals

| Metric | Target | React Alternative |
|--------|--------|-------------------|
| Bundle Size | ~12KB | ~45KB |
| Runtime | Native WAAPI | JavaScript engine |
| Initialization | <5ms | Variable |
| Animation | 60fps | 60fps |

## 🚀 Quick Start

### Installation

```bash
npm install svelte-animate-icons
```

### Basic Usage

```svelte
<script>
  import { BellIcon } from 'svelte-animate-icons';
  
  let bellRef;
</script>

<!-- Auto animation on hover -->
<BellIcon size={32} />

<!-- Programmatic control -->
<button on:click={() => bellRef.startAnimation()}>
  Animate
</button>
<BellIcon bind:this={bellRef} size={32} />
```

## 📚 Available Icons

Currently available icons with animations:

- ✅ **BellIcon** - Ringing animation with clapper motion

*More icons are being added regularly! Each icon is hand-crafted with smooth, performant animations.*

## 🛠️ API Reference

### Icon Props

```typescript
interface IconProps {
  size?: number;           // Icon size in pixels (default: 24)
  class?: string;          // CSS classes
  // All standard HTML div props
}
```

### Icon Methods

```typescript
interface IconHandle {
  startAnimation(): void;  // Start the animation
  stopAnimation(): void;   // Stop the animation
  isAnimating(): boolean;  // Check if currently animating
}
```

### Example

```svelte
<script>
  import { BellIcon } from 'svelte-animate-icons';
  
  let iconRef;
  let isPlaying = $state(false);
  
  function toggleAnimation() {
    if (iconRef.isAnimating()) {
      iconRef.stopAnimation();
      isPlaying = false;
    } else {
      iconRef.startAnimation();
      isPlaying = true;
    }
  }
</script>

<BellIcon 
  bind:this={iconRef}
  size={48}
  class="text-blue-500"
/>

<button on:click={toggleAnimation}>
  {isPlaying ? 'Stop' : 'Play'} Animation
</button>
```

## 🎨 Design System

The project follows Svelte's official design language with:

- **Color Palette**: Svelte Orange (#ff3e00) as primary
- **Typography**: Inter font family
- **Spacing**: Consistent scale system
- **Glass Effects**: Backdrop blur and transparency
- **Mobile-First**: Touch-friendly interactions

## 🏗️ Architecture

Built with modern web standards:

- **Svelte 5 Runes** - Reactive state management
- **Web Animations API** - Native browser animations
- **TypeScript** - Type safety and DX
- **Vite** - Fast build system
- **CSS Custom Properties** - Theme system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Serhat YILDIZ**
- Frontend Developer
- 📧 [serhatgulcanyldz04@gmail.com](mailto:serhatgulcanyldz04@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/serhat-yldz/)
- 🐙 [GitHub](https://github.com/serhat-yildiz)
- 🐦 [X (Twitter)](https://x.com/themedess)

## 🙏 Acknowledgments

- Inspired by [Lucide Icons](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- Built on the shoulders of the amazing Svelte team
- Thanks to the open-source community

---

*Made with ❤️ for the Svelte community*
