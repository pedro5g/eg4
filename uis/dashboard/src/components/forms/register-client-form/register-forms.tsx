import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { RegisterFormFistStep } from "./step-one";
import { RegisterFormSecondStep } from "./step-two";
import { Overview } from "./overview";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimationDiv } from "./animation-div";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-provider";

export const RegisterClientForms = () => {
  const { currentStep } = useStepsControl();
  const [direction, setDirection] = useState(1);
  const [stepControl, setStepControl] = useState(() => currentStep);

  useEffect(() => {
    setStepControl((prev) => {
      if (prev > currentStep) {
        setDirection(-1);
        return currentStep;
      }
      setDirection(1);
      return currentStep;
    });
  }, [currentStep]);

  return (
    <div className="space-y-4 px-4 sm:px-6 md:px-10">
      <div className="w-full py-4">
        <h3 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100">
          Cadastrar Cliente
        </h3>
      </div>
      <div>
        <div>
          <AnimatePresence custom={1} mode="wait" initial={false}>
            <ProgressBar />
          </AnimatePresence>
        </div>
      </div>
      <div className="flex-1">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          {stepControl === 1 ? (
            <RegisterFormFistStep direction={direction} key="one" />
          ) : null}
          {stepControl === 2 ? (
            <RegisterFormSecondStep direction={direction} key="two" />
          ) : null}
          {stepControl === 3 ? (
            <Overview direction={direction} key="three" />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function ProgressBar() {
  const { currentStep, navigate } = useStepsControl();
  return (
    <AnimationDiv
      direction={1}
      className="flex select-none items-center justify-between gap-4 border-b-2 border-zinc-200 dark:border-zinc-400 px-5 pb-8">
      <StepCircle onClick={() => navigate(1)} step={1} fill />

      <StepBar fill={currentStep >= 2} />
      <StepCircle
        onClick={() => navigate(2)}
        step={2}
        fill={currentStep >= 2}
      />

      <StepBar fill={currentStep >= 3} />
      <StepCircle
        onClick={() => navigate(3)}
        step={3}
        fill={currentStep >= 3}
      />
    </AnimationDiv>
  );
}

function StepCircle({
  step,
  fill,
  onClick,
}: {
  step: number;
  fill: boolean;
  onClick: () => void;
}) {
  const { theme } = useTheme();
  return (
    <div
      tabIndex={1}
      onClick={onClick}
      className={cn(
        "relative size-[34px] shrink-0 overflow-hidden rounded-full ring-4 dark:ring-blue-500 ring-blue-300 cursor-pointer transition-all duration-200 hover:scale-105"
      )}>
      <motion.span
        animate={{
          backgroundColor: fill
            ? theme === "light"
              ? "var(--color-blue-500)"
              : "var(--color-slate-800)"
            : theme === "light"
            ? "var(--color-blue-200)"
            : "var(--color-slate-500)",
        }}
        transition={{ duration: 0.2 }}
        className="absolute flex h-full w-full items-center justify-center text-white font-bold">
        {step}
      </motion.span>
    </div>
  );
}

function StepBar({ fill }: { fill: boolean }) {
  return (
    <div
      className={cn(
        "relative hidden h-[6px] w-full overflow-hidden rounded-[50px] bg-zinc-200 dark:bg-blue-200 sm:block",
        "before:absolute before:-left-full before:h-[6px] before:w-full before:bg-blue-500 before:duration-200 before:content-['']",
        fill ? "before:left-0 " : "before:delay-150"
      )}></div>
  );
}
