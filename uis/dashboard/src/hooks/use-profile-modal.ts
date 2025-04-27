import { parseAsBoolean, useQueryState } from "nuqs";

export const useProfileModal = () => {
  const [open, setOpen] = useQueryState(
    "profile-modal",
    parseAsBoolean.withDefault(false)
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
    setOpen,
  };
};
