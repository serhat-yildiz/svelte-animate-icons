<script lang="ts">
  import { CircleAlertIcon, TriangleAlertIcon } from '$lib';
  import { onMount } from 'svelte';

  let isVisible = $state(true);
  let isDismissed = $state(false);

  // Icon refs for programmatic control
  let triangleIconRef: any;
  let circleIconRef: any;

  onMount(() => {
    // Check if user has already dismissed the announcement
    const dismissed = localStorage.getItem('help-announcement-dismissed');
    if (dismissed === 'true') {
      isDismissed = true;
      isVisible = false;
    }
  });

  function dismissAnnouncement() {
    isVisible = false;
    isDismissed = true;
    localStorage.setItem('help-announcement-dismissed', 'true');
  }

  function showAnnouncement() {
    isVisible = true;
    isDismissed = false;
    localStorage.removeItem('help-announcement-dismissed');
  }

  // Hover functions
  function handleBannerMouseEnter() {
    triangleIconRef?.start?.();
  }

  function handleBannerMouseLeave() {
    triangleIconRef?.stop?.();
  }

  function handleButtonMouseEnter() {
    circleIconRef?.start?.();
  }

  function handleButtonMouseLeave() {
    circleIconRef?.stop?.();
  }
</script>

{#if isVisible && !isDismissed}
  <div
    class="announcement"
    onmouseenter={handleBannerMouseEnter}
    onmouseleave={handleBannerMouseLeave}
  >
    <div class="announcement-content">
      <div class="announcement-icon">
        <TriangleAlertIcon bind:this={triangleIconRef} size={32} />
      </div>
      <div class="announcement-text">
        <h3>Help Wanted!</h3>
        <p>
          We need your help to fix <strong>689 TypeScript errors</strong> and get
          this library production-ready! Join our community effort to make Svelte
          Animate Icons even better.
        </p>
        <div class="announcement-actions">
          <a href="#help-section" class="btn-primary">How to Help</a>
          <a
            href="https://github.com/serhat-yildiz/svelte-animate-icons"
            class="btn-secondary"
            target="_blank"
            rel="noopener"
          >
            View on GitHub
          </a>
        </div>
      </div>
      <button
        type="button"
        class="dismiss-btn"
        onclick={dismissAnnouncement}
        aria-label="Dismiss announcement"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
{/if}

{#if isDismissed}
  <button
    type="button"
    class="show-announcement-btn"
    onclick={showAnnouncement}
    title="Show help announcement"
    onmouseenter={handleButtonMouseEnter}
    onmouseleave={handleButtonMouseLeave}
  >
    <CircleAlertIcon bind:this={circleIconRef} size={20} />
    Help Wanted
  </button>
{/if}

<style>
  .announcement {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #ff3e00, #ff6b35);
    color: white;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .announcement-content {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    gap: 1rem;
  }

  .announcement-icon {
    animation: pulse 2s infinite;
    color: white;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .announcement-text {
    flex: 1;
  }

  .announcement-text h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .announcement-text p {
    margin: 0 0 1rem 0;
    opacity: 0.95;
    line-height: 1.5;
  }

  .announcement-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .btn-primary {
    background: white;
    color: #ff3e00;
    border-color: white;
  }

  .btn-primary:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: transparent;
    color: white;
    border-color: white;
  }

  .btn-secondary:hover {
    background: white;
    color: #ff3e00;
    transform: translateY(-1px);
  }

  .dismiss-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dismiss-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .show-announcement-btn {
    position: fixed;
    top: 7rem;
    right: 1rem;
    background: #ff3e00;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(255, 62, 0, 0.3);
    transition: all 0.2s ease;
    z-index: 999;
  }

  .show-announcement-btn:hover {
    background: #e63500;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 62, 0, 0.4);
  }

  @media (max-width: 768px) {
    .announcement-content {
      padding: 1rem;
      flex-direction: column;
      text-align: center;
    }

    .announcement-actions {
      justify-content: center;
    }

    .show-announcement-btn {
      top: 6rem;
      right: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }
  }
</style>
