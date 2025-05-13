import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { randomString } from "@/core/helpers"
import { subMonths } from "date-fns"

const prisma = new PrismaClient()

function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}${month}${year}`
}

function uniqueEmail(email: string) {
  const [start, end] = email.split("@")
  const uniqueCode = randomString(12)
  return `${start}${uniqueCode}@${end}`
}

function generateTaxIdAndDetails() {
  const isCpf = Math.random() < 0.5

  if (isCpf) {
    const taxId = faker.string.numeric(11)
    return {
      taxId,
      type: "F",
      openingDate: formatDateToString(faker.date.birthdate()),
      tradeName: null,
    }
  } else {
    const taxId = faker.string.numeric(14)
    return {
      taxId,
      type: "J",
      openingDate: formatDateToString(faker.date.birthdate()),
      tradeName: faker.company.name(),
    }
  }
}

async function main() {
  const length = parseInt(process.argv[2]) || 1000

  const author = await prisma.user.findFirst()

  if (!author) {
    throw new Error(
      "No users found. Please create one before running the seed.",
    )
  }

  const states = ["SP", "RJ", "MG", "BA", "RS", "SC", "PR", "PE", "CE", "GO"]

  const statuses = ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"] as const

  const clients = Array.from({ length }, (_, i) => {
    const { taxId, type, openingDate, tradeName } = generateTaxIdAndDetails()

    const state = faker.helpers.arrayElement(states)
    const name = faker.person.fullName()
    const code = randomString(10)

    return {
      code,
      address: faker.location
        .streetAddress()
        .concat(" n°", faker.string.numeric({ length: { min: 2, max: 4 } })),
      state,
      cityCode: Math.random() > 0.3 ? faker.location.zipCode("#####") : null,
      name,
      tradeName,
      neighborhood: faker.location.secondaryAddress(),
      zipCode: Math.random() > 0.3 ? faker.location.zipCode("########") : null,
      city: faker.location.city(),
      areaCode:
        Math.random() > 0.5
          ? faker.number.int({ min: 11, max: 99 }).toString()
          : null,
      phone:
        Math.random() > 0.2
          ? faker.string.numeric({ length: Math.random() > 0.2 ? 8 : 9 })
          : null,
      type,
      email:
        Math.random() > 0.2
          ? uniqueEmail(faker.internet.email().toLowerCase())
          : null,
      country: "BR",
      taxId,
      openingDate,
      homepage: Math.random() > 0.5 ? faker.internet.url() : null,
      status: faker.helpers.arrayElement(statuses),
      registrationDate: faker.date.between({
        from: subMonths(new Date(), 5),
        to: new Date(),
      }),
      storeId: null,
      authorId: author.id,
    }
  })

  await prisma.client.createMany({
    data: clients,
  })

  console.log("Customer seed generated successfully 🌱🌱🌱🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
