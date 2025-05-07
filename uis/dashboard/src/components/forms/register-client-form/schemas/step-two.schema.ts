import { z } from "zod";
import {
  addressSchema,
  stateSchema,
  cityCodeSchema,
  zipCodeSchema,
  countrySchema,
  citySchema,
  neighborhoodSchema,
  houseNumberSchema,
} from "./utils.schema";

export const stepTwoSchema = z
  .object({
    address: addressSchema,
    state: stateSchema,
    cityCode: cityCodeSchema,
    zipCode: zipCodeSchema,
    country: countrySchema,
    city: citySchema,
    neighborhood: neighborhoodSchema,
    houseNumber: houseNumberSchema,
  })
  .transform(({ houseNumber, address, ...rest }) => {
    return { address: address.concat(" ", houseNumber), houseNumber, ...rest };
  });

export type StepTwoSchema = z.infer<typeof stepTwoSchema>;
