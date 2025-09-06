// prisma/seed.ts (ou .mts/.ts)
import { PrismaClient } from "@prisma/client";
import { hash, argon2id } from "argon2";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const db = new PrismaClient();

async function main() {
  console.log("Seeding hardcore rpg players...");

  /* if ((await db.user.count()) > 0) {
    console.log("Racoons are already seeded, aborting.");
    return;
  } */

  // 1) Récupération des identifiants

  let email = process.env.SEED_ADMIN_EMAIL;
  let password = process.env.SEED_ADMIN_PASSWORD;
  let name = process.env.SEED_ADMIN_NAME;
  const rl = readline.createInterface({ input, output });

  if (!email || !password || !name) {
    email = await rl.question("email de l'administrateur : ");
    password = await rl.question("mot de passe de l'administrateur : ");
    name = await rl.question("nom de l'administrateur : ");
  }

  await rl.close();

  // 2) Création de l'admin
  const hashed = await hash(password, { type: argon2id });
  await db.user.upsert({
    where: { email: email },
    update: {},
    create: {
      name: name,
      email: email,
      password: hashed, // <-- correspond au schéma
      role: "administrateur",
    },
  });

  console.log("Seeding hardcore rpg players finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
