<script lang="ts">
  import {
    BookIcon,
    CircleAlertIcon,
    CopyIcon,
    GithubIcon,
    StarIcon,
    TriangleAlertIcon,
    UsersIcon,
  } from '$lib';
  import { onMount } from 'svelte';

  let helpSection: HTMLElement;

  // Icon refs for programmatic control
  let triangleIconRef: any;
  let circleIconRef: any;
  let starIconRef: any;
  let bookIconRef: any;
  let usersIconRef: any;
  let githubIconRef: any;
  let copyIconRef: any;

  onMount(() => {
    // Smooth scroll to help section when announcement is clicked
    const handleHashChange = () => {
      if (window.location.hash === '#help-section') {
        helpSection?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  // Hover functions for cards
  function handleCardMouseEnter(iconRef: any) {
    iconRef?.start?.();
  }

  function handleCardMouseLeave(iconRef: any) {
    iconRef?.stop?.();
  }

  // Hover functions for buttons
  function handleButtonMouseEnter(iconRef: any) {
    iconRef?.start?.();
  }

  function handleButtonMouseLeave(iconRef: any) {
    iconRef?.stop?.();
  }
</script>

<section id="help-section" bind:this={helpSection} class="help-section">
  <div class="container">
    <div class="help-header">
      <div class="help-title-icon">
        <UsersIcon bind:this={usersIconRef} size={48} />
      </div>
      <h2 class="help-title">Help Wanted!</h2>
      <p class="help-subtitle">
        We need your help to fix <strong>689 TypeScript errors</strong> and get this
        library production-ready!
      </p>
    </div>

    <div class="help-grid">
      <div
        class="help-card"
        onmouseenter={() => handleCardMouseEnter(triangleIconRef)}
        onmouseleave={() => handleCardMouseLeave(triangleIconRef)}
      >
        <div class="help-icon">
          <TriangleAlertIcon bind:this={triangleIconRef} size={40} />
        </div>
        <h3>Current Issues</h3>
        <ul>
          <li>Interface export issues (689 errors)</li>
          <li>SVG element type casting</li>
          <li>Animation state consistency</li>
          <li>Code optimization needed</li>
        </ul>
      </div>

      <div
        class="help-card"
        onmouseenter={() => handleCardMouseEnter(circleIconRef)}
        onmouseleave={() => handleCardMouseLeave(circleIconRef)}
      >
        <div class="help-icon">
          <CircleAlertIcon bind:this={circleIconRef} size={40} />
        </div>
        <h3>How to Help</h3>
        <ol>
          <li>Fork the repository</li>
          <li>Pick an icon file to fix</li>
          <li>
            Move interfaces to <code>&lt;script context="module"&gt;</code>
          </li>
          <li>Add proper SVG type casting</li>
          <li>Submit a pull request</li>
        </ol>
      </div>

      <div
        class="help-card"
        onmouseenter={() => handleCardMouseEnter(starIconRef)}
        onmouseleave={() => handleCardMouseLeave(starIconRef)}
      >
        <div class="help-icon">
          <StarIcon bind:this={starIconRef} size={40} />
        </div>
        <h3>What You Get</h3>
        <ul>
          <li>Contributor credit</li>
          <li>Experience with Svelte 5</li>
          <li>Access to 551 animated icons</li>
          <li>Help build the Svelte ecosystem</li>
          <li>Portfolio project</li>
        </ul>
      </div>

      <div
        class="help-card"
        onmouseenter={() => handleCardMouseEnter(bookIconRef)}
        onmouseleave={() => handleCardMouseLeave(bookIconRef)}
      >
        <div class="help-icon">
          <BookIcon bind:this={bookIconRef} size={40} />
        </div>
        <h3>Resources</h3>
        <ul>
          <li>
            <a
              href="https://svelte.dev/docs/svelte-components#script-context-module"
              target="_blank"
              rel="noopener">Svelte 5 Interface Guide</a
            >
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement"
              target="_blank"
              rel="noopener">SVG Type Casting</a
            >
          </li>
          <li>
            <a
              href="https://github.com/serhat-yildiz/svelte-animate-icons"
              target="_blank"
              rel="noopener">GitHub Repository</a
            >
          </li>
          <li>
            <a
              href="https://www.npmjs.com/package/svelte-animate-icons"
              target="_blank"
              rel="noopener">NPM Package</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="help-actions">
      <a
        href="https://github.com/serhat-yildiz/svelte-animate-icons"
        class="btn-primary"
        target="_blank"
        rel="noopener"
        onmouseenter={() => handleButtonMouseEnter(githubIconRef)}
        onmouseleave={() => handleButtonMouseLeave(githubIconRef)}
      >
        <GithubIcon bind:this={githubIconRef} size={20} />
        View on GitHub
      </a>
      <a
        href="https://github.com/serhat-yildiz/svelte-animate-icons/fork"
        class="btn-secondary"
        target="_blank"
        rel="noopener"
        onmouseenter={() => handleButtonMouseEnter(copyIconRef)}
        onmouseleave={() => handleButtonMouseLeave(copyIconRef)}
      >
        <CopyIcon bind:this={copyIconRef} size={20} />
        Fork Repository
      </a>
    </div>

    <div class="help-footer">
      <p>
        <strong>Questions?</strong> Feel free to open a discussion on GitHub or reach
        out to us!
      </p>
    </div>
  </div>
</section>

<style>
  .help-section {
    background: radial-gradient(
        circle at 20% 20%,
        rgba(255, 62, 0, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(255, 107, 53, 0.05) 0%,
        transparent 50%
      );
    padding: 4rem 0;
    border-top: 1px solid #e5e7eb;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .help-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .help-title-icon {
    margin-bottom: 1rem;
    color: #ff3e00;
  }

  .help-header .help-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #e5e7eb;
    margin: 0 0 1rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .help-subtitle {
    font-size: 1.25rem;
    color: #e5e7eb;
    margin: 0;
    line-height: 1.6;
    font-weight: 500;
  }

  .help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .help-card {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .help-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .help-icon {
    margin-bottom: 1rem;
    text-align: center;
    color: #ff3e00;
  }

  .help-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .help-card ul,
  .help-card ol {
    margin: 0;
    padding-left: 1.5rem;
    color: #4a5568;
    line-height: 1.6;
    font-weight: 500;
  }

  .help-card li {
    margin-bottom: 0.5rem;
  }

  .help-card code {
    background: rgba(255, 62, 0, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    color: #ff3e00;
    font-weight: 600;
  }

  .help-card a {
    color: #ff3e00;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .help-card a:hover {
    color: #e63500;
    text-decoration: underline;
  }

  .help-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .btn-primary {
    background: #ff3e00;
    color: white;
    border-color: #ff3e00;
  }

  .btn-primary:hover {
    background: #e63500;
    border-color: #e63500;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 62, 0, 0.3);
  }

  .btn-secondary {
    background: white;
    color: #ff3e00;
    border-color: #ff3e00;
  }

  .btn-secondary:hover {
    background: #ff3e00;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 62, 0, 0.3);
  }

  .help-footer {
    text-align: center;
    padding: 2rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .help-footer p {
    margin: 0;
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .help-section {
      padding: 2rem 0;
    }

    .container {
      padding: 0 1rem;
    }

    .help-header h2 {
      font-size: 2rem;
      color: #e5e7eb;
    }

    .help-subtitle {
      font-size: 1.1rem;
    }

    .help-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .help-card {
      padding: 1.5rem;
    }

    .help-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }
</style>
