import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { CircleAlert, Loader2 } from "lucide-react";
import { JSX, useCallback } from "react";
import {
  cn,
  formatCEP,
  formatCpfCnpj,
  formatCurrency,
  formatDate,
  formatPhone,
} from "@/lib/utils";
import { useFloatingBg } from "./hooks/use-floating-bg";

export interface TextFieldProps<T extends FieldValues>
  extends Omit<
    React.ComponentProps<"input">,
    "placeholder" | "onChange" | "readOnly"
  > {
  name: Path<T>;
  label: string;
  type?: "text" | "email";
  mask?: "phone" | "cpf/cnpj" | "cep" | "date" | "currency";
  required?: boolean;
  readonly?: boolean;
  changeInterceptor?: (...value: any[]) => void;
  isLoading?: boolean;
  IconLeft?: () => JSX.Element | null;
}

export const TextField = <T extends FieldValues = any>({
  name,
  type = "text",
  label,
  required = false,
  readonly = false,
  mask,
  changeInterceptor,
  isLoading,
  className,
  IconLeft,
  ...props
}: TextFieldProps<T>) => {
  const { control } = useFormContext<T>();
  const { bgColor, parentRef } = useFloatingBg();

  const cleanFormat = (value: string) => {
    return value.replace(/\D/g, "").trim();
  };

  const applyMask = useCallback((value: string, maskType?: string) => {
    if (!value) return "";

    switch (maskType) {
      case "phone":
        return formatPhone(value);
      case "cpf/cnpj":
        return formatCpfCnpj(value);
      case "cep":
        return formatCEP(value);
      case "date":
        return formatDate(value);
      case "currency":
        return formatCurrency(value);
      default:
        return value;
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, onChange, value, ref },
        fieldState: { invalid, error },
      }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const formattedValue = mask
            ? applyMask(inputValue, mask)
            : inputValue;

          if (mask) {
            changeInterceptor && changeInterceptor(cleanFormat(formattedValue));
            onChange(cleanFormat(formattedValue));
          } else {
            changeInterceptor && changeInterceptor(inputValue);
            onChange(inputValue);
          }
        };

        return (
          <div ref={parentRef} className="w-full space-y-1">
            <div className="relative">
              <input
                name={name}
                ref={ref}
                onChange={handleChange}
                value={
                  mask && value
                    ? applyMask(value.toString(), mask)
                    : value || ""
                }
                {...props}
                type={type}
                data-error={invalid}
                required={required}
                readOnly={readonly}
                id={`floating_outlined_${label}`}
                className={cn(
                  `block px-3 pb-2.5 pt-4 w-full text-sm text-zinc-500 dark:text-zinc-300 bg-transparent duration-300 transform   
              rounded-sm border-2 border-zinc-500/40 dark:border-zinc-100/40 appearance-none data-[error=true]:border-red-500
              focus:outline-none focus:ring-0 focus:border-blue-400 dark:focus:border-blue-400 peer`,
                  IconLeft && "pl-10",
                  className
                )}
                placeholder={" "}
              />
              <label
                htmlFor={`floating_outlined_${label}`}
                data-error={invalid}
                style={{
                  //@ts-ignore
                  "--dark-floating": bgColor,
                }}
                className={cn(
                  `absolute text-base text-zinc-500 duration-300 transform 
                -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 start-1.5 dark:bg-[var(--dark-floating)]
                peer-focus:px-2 peer-focus:text-blue-400 data-[error=true]:text-red-500
                `,
                  !IconLeft &&
                    ` peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                    peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5
                    rtl:peer-focus:translate-x-2/4 rtl:peer-focus:left-auto`
                )}>
                {label}
                {required && <span className="text-xl leading-0">*</span>}
              </label>
              {isLoading && (
                <span className="absolute top-1/2 -translate-y-1/2 right-3">
                  <Loader2 className="text-zinc-300 animate-spin" size={16} />
                </span>
              )}
              {IconLeft && (
                <div className="absolute left-3 top-1/2 -translate-y-1/3 text-zinc-500 peer-focus:text-blue-500">
                  <IconLeft />
                </div>
              )}
            </div>
            {invalid && error?.message && (
              <p className="text-sm text-red-500 font-normal inline-flex items-center gap-1">
                <CircleAlert size={20} />
                <span className="max-w-full truncate">{error.message}</span>
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
