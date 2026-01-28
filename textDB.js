import fs from "node:fs";
import { createReadStream } from "node:fs";

const db = [];
const stream = createReadStream("words.txt", { encoding: "utf-8" });
let text = "";
stream.on("data", (chunk) => {
  text += chunk;
});

let size = 120;
stream.on("end", () => {
  fs.writeFile(
    "words.js",
    "export default " + JSON.stringify(text.split("\n"), null, 5),
    (e) => {
      if (e) throw Error(e);
    },
  );
});
