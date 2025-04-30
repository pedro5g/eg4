import { createContext, useCallback, useContext, useState } from "react";
import { RegisterClientSchemaType } from "./schemas/register-client-form-schema";

type Optional<T> = { [K in keyof T]?: T[K] };
type Props = {
  currentFormData: Optional<RegisterClientSchemaType>;
  clearFormData: () => void;
  setFormData: (data: Optional<RegisterClientSchemaType>) => void;
};

const FormProvider = createContext<Props | null>(null);

const LOCAL_STORAGE_KEY = "register_client_form";

export const RegisterClientFormContext = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [_formData, _setFormData] = useState<
    Optional<RegisterClientSchemaType>
  >(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  });

  const clearFormData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    _setFormData({});
  }, [_setFormData]);

  const setFormData = useCallback(
    (data: Optional<RegisterClientSchemaType>) => {
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

  return (
    <FormProvider.Provider
      value={{
        currentFormData: _formData,
        setFormData,
        clearFormData,
      }}>
      {children}
    </FormProvider.Provider>
  );
};

export const useRegisterClientForm = () => {
  const context = useContext(FormProvider);

  if (!context) {
    throw new Error(
      "useRegisterClientForm must be used within RegisterClientFormContext"
    );
  }
  return context;
};
