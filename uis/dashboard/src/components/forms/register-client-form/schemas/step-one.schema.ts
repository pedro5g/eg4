import { z } from "zod";
import {
  contactSchema,
  emailSchema,
  homepageSchema,
  nameSchema,
  storeCodeSchema,
  taxIdSchema,
} from "./utils.schema";

export const stepOneSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    homepage: homepageSchema,
    storeId: storeCodeSchema,
  })
  .and(contactSchema)
  .and(taxIdSchema);

export type StepOneSchema = z.infer<typeof stepOneSchema>;
