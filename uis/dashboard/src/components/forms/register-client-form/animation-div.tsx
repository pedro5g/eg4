import { motion, Variants } from "framer-motion";

interface AnimationDivProps extends React.ComponentProps<"div"> {
  direction: number;
}

export const AnimationDiv = ({
  children,
  className,
  direction,
}: AnimationDivProps) => {
  const animation = (variants: Variants, custom: number) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
      custom,
    };
  };

  const nextStep: Variants = {
    initial: (direction) => ({
      x: 300 * direction,
      opacity: 0,
    }),
    enter: {
      scale: 1,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
        type: "tween",
      },
    },
    exit: (direction) => ({
      x: -300 * direction,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
        type: "tween",
      },
    }),
  };

  return (
    <motion.div
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
      className={className}
      {...animation(nextStep, direction)}>
      {children}
    </motion.div>
  );
};
