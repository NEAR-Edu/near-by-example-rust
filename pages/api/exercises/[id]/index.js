import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  const { id } = req.query;

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
