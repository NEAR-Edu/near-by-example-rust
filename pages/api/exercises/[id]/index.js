import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  const { id } = req.query;

  console.log(readdirSync(process.cwd()));
  console.log(readdirSync(`${process.cwd()}/.next`));
  console.log(readdirSync(`${process.cwd()}/.next/server`));
  console.log(readdirSync(`${process.cwd()}/.next/server/chunks`));

  const explaination = readFileSync(
    join(process.cwd(), "exercises", id, "README.md"),
    "utf-8"
  );
  const starterCode = readFileSync(
    join(process.cwd(), "exercises", id, "lib.rs"),
    "utf-8"
  );
  const testCode = readFileSync(
    join(process.cwd(), "exercises", id, "test.rs"),
    "utf-8"
  );

  res.send({ explaination, starterCode, testCode });
}
