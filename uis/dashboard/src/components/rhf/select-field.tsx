import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { CircleAlert } from "lucide-react";

type Option = {
  title: string;
  value: string;
};

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options?: Option[];
  required?: boolean;
  readonly?: boolean;
}

export const SelectField = <T extends FieldValues>({
  name,
  label,
  required = false,
  options = [],
  readonly = false,
}: SelectFieldProps<T>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { name, onChange, value, ref },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="w-full space-y-1">
            <Select
              data-error={invalid}
              name={name}
              value={value}
              onValueChange={onChange}>
              <div className="relative">
                <SelectTrigger
                  ref={ref}
                  aria-readonly={readonly}
                  className={cn(
                    `inline-flex px-3 pb-2.5 pt-4 w-full text-sm text-zinc-500 bg-transparent 
                    duration-300 transform rounded-sm border-2 border-zinc-500/40 appearance-none focus-visible:ring-0
                    data-[state=open]:border-blue-400 data-[state=open]:[&>label]:text-blue-400 disabled:opacity-100 focus:border-blue-400`,
                    invalid &&
                      "border-red-500 [&>svg]:stroke-red-500 cursor-pointer",
                    readonly && "pointer-events-none"
                  )}>
                  <SelectValue />
                  <label
                    htmlFor={`floating_outlined_${label}`}
                    data-error={invalid}
                    className={cn(
                      `absolute text-base text-zinc-500 duration-300 transform 
                    scale-100 z-10 origin-[0] bg-white px-2 not-last:-translate-y-1/2
                    top-1/2 focus:top-2 start-1.5`,
                      value && "-translate-y-5 top-0 scale-75",
                      invalid && "text-red-500"
                    )}>
                    {label}
                    {required && <span className="text-xl leading-0">*</span>}
                  </label>
                </SelectTrigger>

                <SelectContent className="rounded-md pb-2.5 pt-4 ">
                  <SelectGroup>
                    <SelectLabel className="text-base bg-blue-100 rounded-t-md text-zinc-800">
                      {label}
                    </SelectLabel>
                    {options.map(({ value, title }, i) => (
                      <SelectItem
                        className="text-zinc-800"
                        key={`${title}_${i}`}
                        value={value}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </div>
            </Select>

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
