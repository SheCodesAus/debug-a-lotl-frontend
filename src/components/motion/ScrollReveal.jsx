import { motion, useReducedMotion } from "motion/react";

/**
 * Fade + slight slide-up when the block enters the viewport. Respects prefers-reduced-motion.
 */
export default function ScrollReveal({
  as = "section",
  children,
  className,
  delay = 0,
  duration = 1.25,
  y = 20,
  ...rest
}) {
  const reduced = useReducedMotion();
  const skip = reduced === true;
  const MotionComponent = as === "div" ? motion.div : motion.section;

  return (
    <MotionComponent
      initial={skip ? false : { opacity: 0, y }}
      whileInView={skip ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
