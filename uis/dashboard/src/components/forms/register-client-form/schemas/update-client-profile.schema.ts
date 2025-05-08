import { stepTwoSchema } from "./step-two.schema";
import {
  addressSchema,
  areaCodeSchema,
  cityCodeSchema,
  citySchema,
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
    address: addressSchema,
    state: stateSchema,
    cityCode: cityCodeSchema,
    name: nameSchema,
    neighborhood: neighborhoodSchema,
    city: citySchema,
    areaCode: areaCodeSchema,
    phone: phoneSchema,
    email: emailSchema,
    homepage: homepageSchema,
    status: statusSchema,
  })
  .and(taxIdSchema)
  .and(stepTwoSchema);

export type UpdateClientProfileSchema = z.infer<
  typeof updateClientProfileSchema
>;
