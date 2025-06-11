import { stepTwoSchema } from "./step-two.schema";
import {
  emailSchema,
  homepageSchema,
  nameSchema,
  openingDateSchema,
  statusSchema,
  storeCodeSchema,
  tradeNameSchema,
  taxSchema,
  typeSchema,
  contactSchema,
} from "./utils.schema";
import { z } from "zod";

export const overviewSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    homepage: homepageSchema,
    status: statusSchema,
    storeCode: storeCodeSchema,
    taxId: taxSchema.nullable(),
    openingDate: openingDateSchema.nullable(),
    tradeName: tradeNameSchema.nullable(),
    type: typeSchema.nullable(),
  })
  .and(contactSchema)
  .and(stepTwoSchema);

export type OverviewSchema = z.infer<typeof overviewSchema>;
