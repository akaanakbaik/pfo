import { Variants } from "framer-motion";

// Custom premium easing functions for high-end animations
const backOut = [0.25, 0.1, 0.2, 1.1];  // Slightly overshoots then settles
const premiumEasing = [0.25, 0.1, 0.25, 1.0]; // Smooth, cubic-bezier easing
export const luxuryEasing = [0.36, 0.07, 0.19, 0.97]; // Ultra smooth, Apple-like interactions
export const magneticEasing = [0.6, 0.05, -0.01, 0.9]; // Snappy then gentle finish
export const exclusiveEasing = [0.645, 0.045, 0.355, 1]; // Premium cubic-bezier

// Spring physics presets for natural motion
const softSpring = { type: "spring", stiffness: 100, damping: 20, mass: 0.8 };
const bounceSpring = { type: "spring", stiffness: 400, damping: 10, mass: 1, velocity: 2 };
const elasticSpring = { type: "spring", stiffness: 300, damping: 15, velocity: 5 };
export const preciseSpring = { type: "spring", stiffness: 200, damping: 30, mass: 0.5 }; // Precise motion
export const smoothSpring = { type: "spring", damping: 26, stiffness: 170 }; // Apple-like smoothness

/**
 * Premium fade animation with subtle transformations
 * Creates an elegant, high-end appearance
 */
export const fadeIn: Variants = {
  hidden: (custom = {}) => ({ 
    opacity: 0,
    scale: 0.97,
    filter: "blur(8px)",
    ...custom
  }),
  visible: (custom = 0) => ({ 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      delay: 0.15 + (custom * 0.08),
      duration: 0.8,
      ease: premiumEasing,
      filter: { duration: 0.9 },
      scale: { duration: 0.7, ease: backOut }
    }
  })
};

/**
 * Luxury slide-in from right with subtle rotation
 * Evokes a sense of premium presentation
 */
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0,
    x: 50,
    rotateY: 5,
    transformPerspective: 1000
  },
  visible: { 
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { 
      ...softSpring,
      opacity: { duration: 0.8 }
    }
  }
};

/**
 * Elegant slide-in from left
 * Perfect for creating balanced visual entrances
 */
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0,
    x: -50, 
    rotateY: -5,
    transformPerspective: 1000
  },
  visible: { 
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { 
      ...softSpring,
      opacity: { duration: 0.8 }
    }
  }
};

/**
 * Refined slide-up animation with slight scaling
 * Creates an expensive, attention-grabbing effect
 */
export const slideInUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 60,
    scale: 0.98
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      ...elasticSpring,
      opacity: { duration: 0.9, ease: premiumEasing }
    }
  }
};

/**
 * Advanced staggered container with customizable orchestration
 * Coordinates child animations with precision timing
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      staggerDirection: 1,
      when: "beforeChildren"
    }
  }
};

/**
 * Premium scale animation with perspective depth
 * Creates an immersive, 3D-like appearance
 */
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.85,
    z: -100,
    rotateX: 5,
    transformPerspective: 1200
  },
  visible: { 
    opacity: 1,
    scale: 1,
    z: 0,
    rotateX: 0,
    transition: { 
      duration: 0.7,
      ease: backOut,
      opacity: { duration: 0.8 }
    }
  }
};

/**
 * High-end bounce animation with spring physics
 * Creates a playful yet sophisticated entrance
 */
export const bounce: Variants = {
  hidden: { 
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: bounceSpring
  }
};

/**
 * Cinematic page transition with blur effect
 * Creates a premium, seamless experience between views
 */
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.98,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: premiumEasing,
      filter: { duration: 0.5 }
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.98,
    filter: "blur(8px)",
    transition: {
      duration: 0.4,
      ease: premiumEasing
    }
  }
};

/**
 * Luxury 3D card hover animation
 * Creates an interactive, premium hover state
 */
export const luxuryCardHover = {
  rest: { 
    scale: 1, 
    rotateY: 0, 
    rotateX: 0,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.05)"
  },
  hover: { 
    scale: 1.02, 
    rotateY: 5, 
    rotateX: 5,
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.4,
      ease: premiumEasing
    }
  }
};

/**
 * Magnetic text reveal animation
 * Creates a sophisticated text entrance effect
 */
export const magneticTextReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: 90,
    transformPerspective: 1000
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.1 * custom,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1.0]
    }
  })
};

/**
 * Parallax scrolling animation preset
 * Creates depth and dimension as user scrolls
 */
export const parallaxScroll = (strength = 0.1) => ({
  y: strength * 100,
  transition: {
    ease: "linear",
    duration: 0.2
  }
});

/**
 * Magnetic hover effect with subtle attraction
 * Elements appear to be attracted to the cursor
 */
export const magneticHover = {
  rest: { 
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  hover: (distance: number = 10) => ({
    scale: 1.1,
    x: distance,
    y: distance,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  })
};

/**
 * Ultra-premium stagger fade for sequential elements
 * Creates elegant, orchestrated reveal sequences
 */
export const staggerFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
      ease: luxuryEasing
    }
  }
};

/**
 * Elite loading animation for premium components
 * Perfect for initial state loading or fetching data
 */
export const eliteLoading = {
  initial: { opacity: 0.6, scale: 0.98 },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: 2,
      ease: exclusiveEasing,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

/**
 * Premium 3D rotation with depth perspective
 * Creates an immersive 3D interaction
 */
export const premium3DRotate = {
  rest: { 
    rotateY: 0, 
    rotateX: 0,
    z: 0, 
    transition: preciseSpring
  },
  hover: { 
    rotateY: 10, 
    rotateX: 5,
    z: 50, 
    transition: {
      ...smoothSpring,
      mass: 0.6
    }
  }
};
