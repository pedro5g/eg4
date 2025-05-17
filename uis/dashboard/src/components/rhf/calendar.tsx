import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, CircleAlert } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Matcher } from "react-day-picker";
import { format } from "date-fns";

interface CalendarFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  disable?: Matcher | Matcher[] | undefined;
}

export const CalendarField = <T extends FieldValues>({
  name,
  label,
  disable,
}: CalendarFieldProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ref },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="flex flex-col">
            <label className="text-blue-700 font-medium">{label}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 pb-2.5 pt-4 h-auto text-left text-zinc-600 font-normal rounded-sm border-2 border-zinc-500/40 w-full cursor-pointer focus-visible:border-blue-400 focus-visible:ring-0",
                    !value && "text-muted-foreground"
                  )}>
                  {value ? (
                    format(value, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={ref} className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={onChange}
                  disabled={disable}
                  initialFocus
                  className="rounded-md border border-blue-200"
                />
              </PopoverContent>
            </Popover>
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
