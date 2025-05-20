import { PrismaClient } from "@prisma/client"
import { ar, faker } from "@faker-js/faker"
import { randomString } from "@/core/helpers"
import { subMonths } from "date-fns"
import { EncrypterModule } from "@/modules/encrypter/encrypter.module"
import { z } from "zod"

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

const seedCLISchema = z
  .strictObject({
    "-q": z.coerce.number().positive().default(100),
    "-u": z.string().trim().min(1).optional(),
    "-e": z.string().trim().min(1).email().optional(),
    "-p": z.string().trim().min(6).max(255).optional(),
  })
  .refine((args) => {
    if (args["-u"] && args["-p"] && args["-u"]) return true
    if (!args["-u"] && !args["-p"] && !args["-u"]) return true
    return false
  }, "if one of these [-u -e -p] is passed, all must be passed")
  .transform((args) => {
    return {
      mockQuantity: args["-q"],
      userName: args["-u"] || "UserTest",
      userEmail: args["-e"] || "UserTest@gmail.com",
      userPassword: args["-u"] || "123456",
    }
  })

function seedCli() {
  const args = process.argv.slice(2, 10)

  if (args.length === 1 && args[0] === "-h") {
    console.log(
      "seed cli args\n-q: quantity of client to be mock on db \n-u: userName \n-e: userEmail \n-u: userPassword",
    )
    process.exit(0)
  }

  const _sameConfig = args.reduce(
    (a, v, i, arr) => {
      if (i % 2 === 0) {
        return { ...a, [v]: arr[i + 1] }
      }
      return { ...a }
    },
    {} as Record<string, string>,
  )

  const { data, error, success } = seedCLISchema.safeParse(_sameConfig)

  if (!success) {
    console.error(error?.errors[0].message)
    process.exit(1)
  }

  return data
}

async function main() {
  const { mockQuantity, ...user } = seedCli()

  let author = await prisma.user.findUnique({
    where: {
      email: user.userEmail,
    },
  })

  if (!author) {
    author = await prisma.user.create({
      data: {
        name: user.userName,
        email: user.userEmail,
        password: await EncrypterModule.factory().toHash(user.userPassword),
      },
    })
  }

  if (!author) {
    throw new Error(
      "No users found. Please create one before running the seed.",
    )
  }

  const states = ["SP", "RJ", "MG", "BA", "RS", "SC", "PR", "PE", "CE", "GO"]

  const statuses = ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"] as const

  const clients = Array.from({ length: mockQuantity }, (_, i) => {
    const { taxId, type, openingDate, tradeName } = generateTaxIdAndDetails()

    const state = faker.helpers.arrayElement(states)
    const name = faker.person.fullName()
    const code = randomString(6)

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

  console.log("All done 🌱🌱🌱")
  console.log(
    `Access app using \nEmail: ${user.userName} \nPassword: ${user.userPassword}`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
