import fetch from "node-fetch";

export default function handler(req, res) {
  fetch(process.env.EXECUTE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  })
    .then((res) => res.json())
    .then((json) => res.status(200).json(json))
    .catch((err) => res.status(400).json({ error: err.message }));
}
