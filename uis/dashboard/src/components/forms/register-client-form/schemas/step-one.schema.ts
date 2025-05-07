import { z } from "zod";
import {
  areaCodeSchema,
  emailSchema,
  homepageSchema,
  nameSchema,
  phoneSchema,
  storeCodeSchema,
  taxIdSchema,
} from "./utils.schema";

export const stepOneSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    homepage: homepageSchema,
    areaCode: areaCodeSchema,
    storeCode: storeCodeSchema,
  })
  .transform((values) => {
    if (values.phone) {
      const ddd = values.phone.slice(0, 2);
      const phone = values.phone.slice(2);

      return { ...values, phone, areaCode: ddd };
    }

    if (values.areaCode) {
      return { ...values, areaCode: null };
    }

    return values;
  })
  .and(taxIdSchema);

export type StepOneSchema = z.infer<typeof stepOneSchema>;
