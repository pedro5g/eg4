import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export const FormWrapper = <T extends FieldValues = any>({
  children,
  method,
}: Readonly<{ children: React.ReactNode; method: UseFormReturn<T> }>) => {
  return <FormProvider {...method}>{children}</FormProvider>;
};
