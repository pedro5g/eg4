import { z } from "zod";

const baseSchema = z
  .string()
  .trim()
  .nullable()
  .transform((value) => {
    if (value === "") return null;
    return value;
  });

const cpfSchema = baseSchema.pipe(
  z
    .string()
    .trim()
    .min(11, "Digite um cpf/cnpj valido")
    .max(11, "Digite um cpf/cnpj valido")
    .regex(/[0-9]$/g, "CPF should only have numbers")
    .nullable()
);

const cnpjSchema = baseSchema.pipe(
  z
    .string()
    .trim()
    .min(14, "Digite um cpf/cnpj valido")
    .max(14, "Digite um cpf/cnpj valido")
    .regex(/[0-9]$/g, "CNPJ should only have numbers")
    .nullable()
);

export const mobilePhoneSchema = baseSchema.pipe(
  z
    .string()
    .min(11, "Digite um numero de celular válido")
    .max(11, "Digite um numero de celular válido")
    .regex(/[0-9]$/g)
    .nullable()
);

export const landlinesSchema = baseSchema.pipe(
  z
    .string()
    .min(10, "Digite um numero de telefone válido")
    .max(10, "Digite um numero de telefone válido")
    .regex(/[0-9]$/g)
    .nullable()
);

const baseStringSchema = z.string().trim().min(3).max(255);

const addressSchema = z
  .string()
  .trim()
  .min(3, "Digite um endereço valido")
  .max(255, "O endereço está muito longo");

const stateSchema = z
  .string()
  .trim()
  .min(2)
  .max(2)
  .transform((st) => st.toUpperCase());

const cityCodeSchema = baseSchema.pipe(
  z
    .string()
    .trim()
    .min(2, "Digite o nome de uma cidade valida")
    .max(255, "O nome da cidade está muito longo")
    .nullable()
);
const nameSchema = z
  .string()
  .trim()
  .min(1, "Nome é um campo obrigatório")
  .max(255, "O nome está muito longo");
const tradeNameSchema = baseSchema;
const neighborhoodSchema = baseSchema.pipe(
  z
    .string()
    .trim()
    .min(2, "Digite o nome de um bairro valida")
    .max(255, "O nome do bairro está muito longo")
    .nullable()
);
const zipCodeSchema = baseSchema.pipe(
  z
    .string()
    .min(8, "Digite um cep valido")
    .max(8, "Digite um cep valido")
    .regex(/[0-9]$/g)
    .nullable()
);
const citySchema = baseStringSchema;
const areaCodeSchema = baseSchema.pipe(
  z
    .string()
    .min(2)
    .max(2)
    .regex(/[0-9]$/g)
    .nullable()
);

export const phoneSchema = z.union([mobilePhoneSchema, landlinesSchema]);

const typeSchema = baseSchema;

const emailSchema = baseSchema.pipe(z.string().email().nullable());
const countrySchema = baseSchema;

const taxIdSchema = z.union([cnpjSchema, cpfSchema]);
const openingDateSchema = baseSchema;
const homepageSchema = baseSchema;

const statusSchema = z
  .enum(["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"])
  .optional();
const storeCodeSchema = z
  .string()
  .trim()
  .min(10, "Selecione uma loja")
  .max(10, "Selecione uma loja");

export const registerClientSchema = z.object({
  address: addressSchema,
  state: stateSchema,
  cityCode: cityCodeSchema,
  name: nameSchema,
  tradeName: tradeNameSchema,
  neighborhood: neighborhoodSchema,
  zipCode: zipCodeSchema,
  city: citySchema,
  areaCode: areaCodeSchema,
  phone: phoneSchema,
  type: typeSchema,
  email: emailSchema,
  country: countrySchema,
  taxId: taxIdSchema,
  openingDate: openingDateSchema,
  homepage: homepageSchema,
  status: statusSchema,
  storeCode: storeCodeSchema,
});

export const registerClientFirstStepSchema = z
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
  });

export const registerClientSecondStepSchema = z.object({
  address: addressSchema,
  state: stateSchema,
  cityCode: cityCodeSchema,
  zipCode: zipCodeSchema,
  country: countrySchema,
  city: citySchema,
  neighborhood: neighborhoodSchema,
});

export const registerClientThirdStepSchema = z.object({
  taxId: taxIdSchema,
  openingDate: openingDateSchema,
  tradeName: tradeNameSchema,
  type: typeSchema,
});

export type RegisterClientSchemaType = z.infer<typeof registerClientSchema>;
export type RegisterClientFirstStepSchemaType = z.infer<
  typeof registerClientFirstStepSchema
>;
export type RegisterClientSecondStepSchemaType = z.infer<
  typeof registerClientSecondStepSchema
>;
export type RegisterClientThirdStepSchemaType = z.infer<
  typeof registerClientThirdStepSchema
>;
