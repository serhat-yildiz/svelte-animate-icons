# 🎯 Svelte Animate Icons

Beautiful, performant animated SVG icons for Svelte 5 with runes.

[![npm version](https://badge.fury.io/js/svelte-animate-icons.svg)](https://badge.fury.io/js/svelte-animate-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **130+ animated icons** - Beautiful SVG icons with smooth hover animations
- ⚡ **Lightning fast** - Built with Web Animations API for 60fps performance
- 🎨 **Svelte 5 ready** - Modern runes system and reactivity
- 📦 **Tiny bundle** - Tree-shakeable, import only what you need
- 🎛️ **Easy styling** - CSS-friendly, no complex configurations
- 🔧 **TypeScript** - Full type safety included
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Installation

```bash
npm install svelte-animate-icons
```

### Basic Usage

```svelte
<script>
  import { HeartIcon, BellIcon, ActivityIcon } from 'svelte-animate-icons';
</script>

<!-- Simple usage -->
<HeartIcon size={24} />

<!-- With styling -->
<BellIcon size={32} class="text-red-500" />

<!-- All props -->
<ActivityIcon 
  size={28} 
  class="text-blue-600 hover:text-blue-800" 
  onclick={() => console.log('clicked!')}
/>
```

## 📋 Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `28` | Icon size in pixels |
| `class` | `string` | `""` | CSS classes for styling |
| All HTML attributes | | | Standard HTML attributes |

## 🎨 Styling Examples

```svelte
<script>
  import { HeartIcon, StarIcon, CheckIcon } from 'svelte-animate-icons';
</script>

<!-- Tailwind CSS -->
<HeartIcon class="text-red-500 hover:text-red-600" size={32} />

<!-- Custom CSS -->
<StarIcon class="my-star-icon" size={24} />

<!-- Inline styles -->
<CheckIcon 
  size={20} 
  style="color: green; transform: rotate(15deg);"
/>

<style>
  :global(.my-star-icon) {
    color: gold;
    transition: all 0.3s ease;
  }
  
  :global(.my-star-icon:hover) {
    color: orange;
    transform: scale(1.1);
  }
</style>
```

## 🎯 Animation Behavior

All icons come with built-in hover animations:
- **Automatic**: Animations trigger on mouse hover
- **Smooth**: 60fps performance using Web Animations API
- **Accessible**: Respects `prefers-reduced-motion`

## 📚 Available Icons

Browse all 130+ icons at: [Icon Gallery](https://serhat-yildiz.github.io/svelte-animate-icons/#gallery)

### Popular Icons

```svelte
<!-- UI Icons -->
<CheckIcon />
<XIcon />
<MenuIcon />
<SearchIcon />

<!-- Communication -->
<HeartIcon />
<BellIcon />
<MailsIcon />
<MessageCircleIcon />

<!-- Actions -->
<DownloadIcon />
<UploadIcon />
<CopyIcon />
<TrashIcon />

<!-- Currency -->
<DollarSignIcon />
<EuroIcon />
<BitcoinIcon />

<!-- Social -->
<GithubIcon />
<TwitterIcon />
<LinkedinIcon />
<FacebookIcon />
```

## 🛠️ Framework Integration

### SvelteKit

```svelte
<!-- +page.svelte -->
<script>
  import { ActivityIcon, BellIcon } from 'svelte-animate-icons';
</script>

<div class="icon-grid">
  <ActivityIcon size={32} />
  <BellIcon size={32} />
</div>
```

### With Tailwind CSS

```svelte
<script>
  import { HeartIcon } from 'svelte-animate-icons';
</script>

<HeartIcon 
  class="text-red-500 hover:text-red-600 transition-colors duration-200" 
  size={24} 
/>
```

## 📦 Bundle Size

- **Individual icon**: ~2KB gzipped
- **Core runtime**: ~5KB gzipped
- **Tree-shakeable**: Only import what you use

## 🎭 Performance

- **60fps** smooth animations
- **Web Animations API** for optimal performance
- **No runtime dependencies** (except Svelte)
- **Minimal memory footprint**

## 🌐 Browser Support

Modern browsers that support:
- Svelte 5
- Web Animations API
- ES2020+

## 📄 License

MIT © [Serhat YILDIZ](https://github.com/serhat-yildiz)

## 🤝 Contributing

Contributions welcome! Please read our [contributing guide](CONTRIBUTING.md) first.

## 🔗 Links

- [Documentation](https://serhat-yildiz.github.io/svelte-animate-icons/docs)
- [Icon Gallery](https://serhat-yildiz.github.io/svelte-animate-icons/#gallery) 
- [GitHub](https://github.com/serhat-yildiz/svelte-animate-icons)
- [npm](https://www.npmjs.com/package/svelte-animate-icons)

---

Built with ❤️ for the Svelte community.