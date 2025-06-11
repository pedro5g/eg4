import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFloatingBg } from "./hooks/use-floating-bg";

export interface TextFieldProps<T extends FieldValues>
  extends Omit<React.ComponentProps<"input">, "placeholder" | "type"> {
  name: Path<T>;
  label: string;
  show?: boolean;
  required?: boolean;
  readonly?: boolean;
}

export const PasswordField = <T extends FieldValues>({
  name,
  label,
  show = false,
  required = false,
  readonly = false,
  ...props
}: TextFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext();
  const { bgColor, parentRef } = useFloatingBg();
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, onChange, value },
        fieldState: { invalid, error },
      }) => {
        return (
          <div ref={parentRef} className="w-full max-w-md space-y-1">
            <div className="relative">
              <input
                name={name}
                onChange={onChange}
                value={value}
                {...props}
                type={showPassword ? "text" : "password"}
                data-error={invalid}
                required={required}
                readOnly={readonly}
                id={`floating_outlined_${label}`}
                className="block px-3 pb-2.5 pt-4 w-full text-sm text-zinc-500 dark:text-zinc-300 dark:border-zinc-100/40 bg-transparent duration-300 transform   
              rounded-sm border-2 border-zinc-500/40 appearance-none data-[error=true]:border-red-500 dark:data-[error=true]:border-red-500
              focus:outline-none focus:ring-0 focus:border-blue-400 dark:focus:border-blue-400 pr-8 peer"
                placeholder=" "
              />
              {show && (
                <button
                  type="button"
                  className="absolute z-10 top-1/2 -translate-y-1/2 right-2 cursor-pointer 
                text-zinc-500 transition-all duration-300"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
              <label
                htmlFor={`floating_outlined_${label}`}
                data-error={invalid}
                style={{
                  //@ts-ignore
                  "--dark-floating": bgColor,
                }}
                className="absolute text-base text-zinc-500 duration-300 transform 
            -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 dark:bg-[var(--dark-floating)]
            peer-focus:px-2 peer-focus:text-blue-400 data-[error=true]:text-red-500
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
            peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5
            rtl:peer-focus:translate-x-2/4 rtl:peer-focus:left-auto start-1.5">
                {label}
                {required && <span className="text-xl leading-0">*</span>}
              </label>
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
