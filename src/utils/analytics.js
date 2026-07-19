// Sends a page_view event to Google Analytics (GA4).
// Called manually on every route change since GA's default script
// only tracks the very first page load, not React Router navigation.
export function trackPageView(path) {
  if (typeof window.gtag !== 'function') return; // GA script not loaded yet, or blocked (ad blocker etc.)
  window.gtag('event', 'page_view', {
    page_path: path,
  });
}