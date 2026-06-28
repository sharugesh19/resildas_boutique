/**
 * HERO SLIDES
 * ─────────────────────────────────────────────────────────────
 * Each slide gets its own headline + tagline so the hero text
 * updates dynamically as the carousel advances — matching your
 * existing hero-sync.js behaviour.
 *
 * Images reference files in /public/images/
 * (hero-1.jpeg through hero-4.jpeg as per your folder structure)
 * ─────────────────────────────────────────────────────────────
 */

const heroSlides = [
  {
    id:          1,
    image:       '/images/hero-1.jpeg',
    headline:    'Draped in Tradition',
    tagline:     'Curated Kanjivaram & Silk Sarees for Every Occasion',
    cta: {
      label: 'Shop Sarees',
      path:  '/products/sarees',
    },
    overlayDark: true, // true = white text (photo is dark), false = dark text (photo is light)
  },
  {
    id:          2,
    image:       '/images/hero-2.jpeg',
    headline:    'Effortless Elegance',
    tagline:     'New Season Kurthi Sets — Where Comfort Meets Craft',
    cta: {
      label: 'Explore Kurthis',
      path:  '/products/kurthi-sets',
    },
    overlayDark: true,
  },
  {
    id:          3,
    image:       '/images/hero-3.jpeg',
    headline:    'Made to Match',
    tagline:     "Co-ord Sets for the Modern Indian Woman",
    cta: {
      label: 'Shop Co-ords',
      path:  '/products/coord-sets',
    },
    overlayDark: true,
  },
  {
    id:          4,
    image:       '/images/hero-4.jpeg',
    headline:    'Festive Arrivals',
    tagline:     'Handpicked Salwar Sets for the Season',
    cta: {
      label: 'Shop Salwar Sets',
      path:  '/products/salwar-sets',
    },
    overlayDark: false,
  },
]

export default heroSlides