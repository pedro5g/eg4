import { useStepsControl } from "./hooks/use-steps-control";

export const GoToField = ({
  children,
  fieldName,
  step,
}: {
  children: React.ReactNode;
  fieldName: string;
  step: number;
}) => {
  const { goToField } = useStepsControl();
  return (
    <div
      onClick={() => {
        goToField(step, fieldName);
      }}
      className="cursor-pointer w-full">
      {children}
    </div>
  );
};
