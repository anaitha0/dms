// Animation variants for Framer Motion

// Fade in animation
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };
  
  // Slide in from bottom animation
  export const slideInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };
  
  // Slide in from left animation
  export const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };
  
  // Slide in from right animation
  export const slideInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  };
  
  // Scale animation
  export const scale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  };
  
  // Staggered children animation
  export const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };
  
  // Child animation for staggered elements
  export const staggerItem = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };
  
  // List animation variants
  export const listVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  };
  
  // List item animation variants
  export const listItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 },
  };
  
  // Page transition variants
  export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeInOut' },
  };
  
  // Modal animation variants
  export const modalVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  };
  
  // Backdrop for modals
  export const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };
  
  // Button hover animation
  export const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 },
  };
  
  // Card hover animation
  export const cardHover = {
    y: -5,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  };
  
  // Rotating animation (for loading spinners)
  export const rotate = {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
  };
  
  // Pulse animation
  export const pulse = {
    animate: { scale: [1, 1.05, 1] },
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  };