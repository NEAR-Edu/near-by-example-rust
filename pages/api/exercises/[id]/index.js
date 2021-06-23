import { readFile } from "fs";
import fetch from "node-fetch";
import { join } from "path";

const resolveFiles = (id) => {
  const files = ["README.md", "lib.rs", "test.rs"];
  if (process.env.LOCAL) {
    return Promise.all(
      files.map((file) =>
        readFile(join(process.cwd(), "exercises", id, file), "utf-8")
      )
    );
  } else {
    return Promise.all(
      files.map((file) =>
        fetch(
          `https://raw.githubusercontent.com/NEAR-Edu/near-by-example-rust/main/exercises/${id}/${file}`
        ).then((res) => res.text())
      )
    );
  }
};

export default async function handler(req, res) {
  const { id } = req.query;

  const [explaination, starterCode, testCode] = await resolveFiles(id);

  res.send({ explaination, starterCode, testCode });
}
