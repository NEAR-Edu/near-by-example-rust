import { readFileSync } from "fs";
import { join } from "path";

const BASH_PATH = process.env.LOCAL ? process.cwd() : __dirname;

export default function handler(req, res) {
  const { id } = req.query;

  const explaination = readFileSync(
    join(BASH_PATH, "exercises", id, "README.md"),
    "utf-8"
  );
  const starterCode = readFileSync(
    join(BASH_PATH, "exercises", id, "lib.rs"),
    "utf-8"
  );
  const testCode = readFileSync(
    join(BASH_PATH, "exercises", id, "test.rs"),
    "utf-8"
  );

  res.send({ explaination, starterCode, testCode });
}
