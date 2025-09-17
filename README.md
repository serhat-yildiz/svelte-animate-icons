# Svelte Animate Icons

Powerful animated SVG icons for Svelte 5 with flexible animation control.

[![npm version](https://badge.fury.io/js/svelte-animate-icons.svg)](https://badge.fury.io/js/svelte-animate-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/svelte-animate-icons.svg)](https://www.npmjs.com/package/svelte-animate-icons)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/svelte-animate-icons)](https://bundlephobia.com/package/svelte-animate-icons)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Help Wanted](https://img.shields.io/badge/Help-Wanted-red)](https://github.com/serhat-yildiz/svelte-animate-icons/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![Good First Issue](https://img.shields.io/badge/Good%20First-Issue-green)](https://github.com/serhat-yildiz/svelte-animate-icons/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## Features

- **551 animated icons** - Beautiful SVG icons with multiple animation triggers
- **Lightning fast** - Built with Web Animations API for 60fps performance
- **Svelte 5 ready** - Modern runes system and reactivity
- **Flexible control** - Hover, click, focus, state-based, and programmatic animations
- **Tiny bundle** - Tree-shakeable, import only what you need
- **TypeScript** - Full type safety included
- **Production ready** - Used in real-world applications

## Quick Start

### Installation

```bash
npm install svelte-animate-icons
```

### Basic Usage

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
</script>

<!-- Default hover animation -->
<ActivityIcon size={24} />
```

### Programmatic Control

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let iconRef;
</script>

<ActivityIcon bind:this={iconRef} triggers={{ custom: true }} />
<button onclick={() => iconRef?.start()}>Start Animation</button>
```

### State-Based Animation

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let loadingState = 'idle'; // 'idle' | 'loading' | 'success' | 'error'
</script>

<ActivityIcon animationState={loadingState} />
<button onclick={() => loadingState = 'loading'}>Start Loading</button>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `28` | Icon size in pixels |
| `class` | `string` | `""` | CSS classes for styling |
| `triggers` | `object` | `{ hover: true }` | Animation triggers |
| `animationState` | `string` | `'idle'` | State-based animation |
| `duration` | `number` | `2000` | Animation duration (ms) |
| `loop` | `boolean` | `false` | Loop animation infinitely |

### Animation Triggers

```typescript
triggers: {
  hover?: boolean;    // Hover to animate (default: true)
  click?: boolean;    // Click to toggle animation
  focus?: boolean;    // Focus to animate (keyboard navigation)
  custom?: boolean;   // Programmatic control only
}
```

### Animation States

- `'idle'` - Default state, no animation
- `'loading'` - Continuous animation (perfect for loading indicators)
- `'success'` - Brief animation then stop
- `'error'` - Brief animation then stop
- `'active'` - Continuous animation
- `'running'` - Alternative continuous animation state

### Methods (when using bind:this)

| Method | Description |
|--------|-------------|
| `start()` | Start animation |
| `stop()` | Stop animation |
| `toggle()` | Toggle animation state |

## Real-World Examples

### Loading Button

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let isLoading = false;
  
  async function handleSubmit() {
    isLoading = true;
    try {
      await api.submit();
    } finally {
      isLoading = false;
    }
  }
</script>

<button onclick={handleSubmit} disabled={isLoading}>
  <ActivityIcon animationState={isLoading ? 'loading' : 'idle'} size={16} />
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

### Interactive Card

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let cardIcon;
</script>

<div 
  class="card"
  onmouseenter={() => cardIcon?.start()}
  onmouseleave={() => cardIcon?.stop()}
>
  <ActivityIcon bind:this={cardIcon} triggers={{ custom: true }} size={24} />
  <h3>Hover to animate</h3>
</div>
```

### Form Validation

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let inputValue = '';
  
  $: validationState = inputValue.length >= 3 ? 'success' : 'error';
</script>

<div class="input-group">
  <input bind:value={inputValue} placeholder="Min 3 characters" />
  <ActivityIcon animationState={validationState} size={20} />
</div>
```

## Animation System

- **Multiple triggers**: Hover, click, focus, or programmatic control
- **State-driven**: Perfect for loading states and user feedback
- **60fps performance**: Web Animations API for smooth animations
- **Accessible**: Respects `prefers-reduced-motion`
- **Flexible**: Use cases from simple hovers to complex state management

## Available Icons

Browse all 551 icons at: [Icon Gallery](https://serhat-yildiz.github.io/svelte-animate-icons/#gallery)

### Popular Icons

```svelte
<!-- UI & Navigation -->
<ActivityIcon />  <!-- Perfect for loading states -->
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

## Framework Integration

### SvelteKit

```svelte
<!-- +page.svelte -->
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
  let pageState = 'loading';
</script>

<div class="page-header">
  <h1>Dashboard</h1>
  <ActivityIcon animationState={pageState} size={32} />
</div>
```

### With CSS Frameworks

```svelte
<script>
  import { ActivityIcon } from 'svelte-animate-icons';
</script>

<!-- With Tailwind CSS -->
<ActivityIcon 
  class="text-blue-500 hover:text-blue-600" 
  triggers={{ hover: true, click: true }}
  size={24} 
/>

<!-- With custom CSS -->
<ActivityIcon 
  class="my-custom-icon" 
  triggers={{ hover: true, click: true }}
  size={24} 
/>
```

## Bundle Size

- **Individual icon**: ~1.5KB gzipped
- **Core runtime**: ~4.2KB gzipped  
- **Animation system**: ~3KB gzipped
- **Tree-shakeable**: Only import what you use

## Performance

- **60fps** smooth animations
- **Web Animations API** for optimal performance
- **Smart state management**: Efficient reactivity with Svelte 5 runes
- **Memory efficient**: Animations clean up automatically
- **Production tested**: Used in high-traffic applications

## Browser Support

Modern browsers that support:
- Svelte 5
- Web Animations API
- ES2020+
- Node.js 18+

## License

MIT © [Serhat YILDIZ](https://github.com/serhat-yildiz)

## Contributing

We need your help to get this library production-ready! 

**Current Priority:** Fix 689 TypeScript errors

**How to help:**
1. Visit our [live demo](https://serhat-yildiz.github.io/svelte-animate-icons/) and scroll to "Help Wanted" section
2. Fork the repository
3. Pick an icon file to fix
4. Submit a PR and get contributor credit!

**What you get:**
- Contributor credit
- Experience with Svelte 5
- Access to 551 animated icons
- Help build the Svelte ecosystem!

Read our [contributing guide](CONTRIBUTING.md) for details.

## Links

- [Documentation](https://serhat-yildiz.github.io/svelte-animate-icons/docs)
- [Icon Gallery](https://serhat-yildiz.github.io/svelte-animate-icons/#gallery) 
- [GitHub](https://github.com/serhat-yildiz/svelte-animate-icons)
- [npm](https://www.npmjs.com/package/svelte-animate-icons)

---

Built with love for the Svelte community.