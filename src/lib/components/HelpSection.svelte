<script lang="ts">
  import { onMount } from 'svelte';

  let helpSection: HTMLElement;

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
</script>

<section id="help-section" bind:this={helpSection} class="help-section">
  <div class="container">
    <div class="help-header">
      <h2>🤝 Help Wanted!</h2>
      <p class="help-subtitle">
        We need your help to fix <strong>689 TypeScript errors</strong> and get this
        library production-ready!
      </p>
    </div>

    <div class="help-grid">
      <div class="help-card">
        <div class="help-icon">🚨</div>
        <h3>Current Issues</h3>
        <ul>
          <li>Interface export issues (689 errors)</li>
          <li>SVG element type casting</li>
          <li>Animation state consistency</li>
          <li>Code optimization needed</li>
        </ul>
      </div>

      <div class="help-card">
        <div class="help-icon">🎯</div>
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

      <div class="help-card">
        <div class="help-icon">🎁</div>
        <h3>What You Get</h3>
        <ul>
          <li>✅ Contributor credit</li>
          <li>✅ Experience with Svelte 5</li>
          <li>✅ Access to 551 animated icons</li>
          <li>✅ Help build the Svelte ecosystem</li>
          <li>✅ Portfolio project</li>
        </ul>
      </div>

      <div class="help-card">
        <div class="help-icon">📚</div>
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
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          ></path>
        </svg>
        View on GitHub
      </a>
      <a
        href="https://github.com/serhat-yildiz/svelte-animate-icons/fork"
        class="btn-secondary"
        target="_blank"
        rel="noopener"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path
            d="M10 14.66V17c0 .55-.47.98-.97 1.21l-1.25.5c-.5.2-1.28.2-1.78 0l-1.25-.5c-.5-.23-.97-.66-.97-1.21v-2.34"
          ></path>
          <path
            d="M14 14.66V17c0 .55.47.98.97 1.21l1.25.5c.5.2 1.28.2 1.78 0l1.25-.5c.5-.23.97-.66.97-1.21v-2.34"
          ></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
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
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 4rem 0;
    border-top: 1px solid #dee2e6;
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

  .help-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #212529;
    margin: 0 0 1rem 0;
  }

  .help-subtitle {
    font-size: 1.25rem;
    color: #6c757d;
    margin: 0;
    line-height: 1.6;
  }

  .help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .help-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  .help-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .help-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .help-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #212529;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .help-card ul,
  .help-card ol {
    margin: 0;
    padding-left: 1.5rem;
    color: #495057;
    line-height: 1.6;
  }

  .help-card li {
    margin-bottom: 0.5rem;
  }

  .help-card code {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    color: #e83e8c;
  }

  .help-card a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }

  .help-card a:hover {
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
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .help-footer p {
    margin: 0;
    color: #495057;
    font-size: 1.1rem;
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
