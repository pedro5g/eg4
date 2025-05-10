import { stepTwoSchema } from "./step-two.schema";
import {
  addressSchema,
  areaCodeSchema,
  cityCodeSchema,
  citySchema,
  contactSchema,
  emailSchema,
  homepageSchema,
  nameSchema,
  neighborhoodSchema,
  phoneSchema,
  stateSchema,
  statusSchema,
  taxIdSchema,
} from "./utils.schema";
import { z } from "zod";

export const updateClientProfileSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    homepage: homepageSchema,
    status: statusSchema,
  })
  .and(contactSchema)
  .and(taxIdSchema)
  .and(stepTwoSchema);

export type UpdateClientProfileSchema = z.infer<
  typeof updateClientProfileSchema
>;
