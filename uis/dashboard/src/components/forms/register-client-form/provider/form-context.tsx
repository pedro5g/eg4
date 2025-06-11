import { createContext, useCallback, useState } from "react";
import { OverviewSchema } from "../schemas/register-client-form.schema";
import { useStepsControl } from "../hooks/use-steps-control";

type Optional<T> = { [K in keyof T]?: T[K] };
type Props = {
  currentFormData: Optional<OverviewSchema>;
  clearFormData: () => void;
  setFormData: (data: Optional<OverviewSchema>) => void;
  clear: () => void;
};

export const FormProvider = createContext<Props | null>(null);

const LOCAL_STORAGE_KEY = "register_client_form";

export const RegisterClientFormContext = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [_formData, _setFormData] = useState<Optional<OverviewSchema>>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  });
  const { navigate } = useStepsControl();

  const clearFormData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    _setFormData({});
  }, [_setFormData]);

  const setFormData = useCallback(
    (data: Optional<OverviewSchema>) => {
      _setFormData((prev) => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ ...prev, ...data })
        );
        return { ...prev, ...data };
      });
    },
    [_setFormData]
  );
  const clear = () => {
    const confirm = window.confirm("Limpar o formulário ?");
    if (confirm) {
      clearFormData();
      navigate(1);
    }
  };

  return (
    <FormProvider.Provider
      value={{
        currentFormData: _formData,
        setFormData,
        clearFormData,
        clear,
      }}>
      {children}
    </FormProvider.Provider>
  );
};
