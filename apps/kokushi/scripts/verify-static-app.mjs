import { readFileSync } from "node:fs";

const requiredColumns = [
  "id",
  "category",
  "drug_name",
  "class_name",
  "mechanism",
  "target",
  "indication",
  "adverse_effect",
  "exam_point",
  "is_important",
  "memo"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

const csv = readFileSync("data.csv", "utf8").replace(/^\uFEFF/, "");
const lines = csv.trim().split(/\r?\n/);
const header = splitCsvLine(lines[0]);
assert(requiredColumns.every((column) => header.includes(column)), "data.csv is missing required pharmacology columns");
assert(lines.length >= 121, "data.csv should contain at least 120 MVP cards");
const badRows = lines.slice(1)
  .map((line, index) => ({ lineNumber: index + 2, columns: splitCsvLine(line).length }))
  .filter((row) => row.columns !== header.length);
assert(!badRows.length, `data.csv has rows with unexpected column counts: ${JSON.stringify(badRows.slice(0, 10))}`);

const index = readFileSync("index.html", "utf8");
assert(index.includes("国試対策 作用機序マスター カメラ改造版"), "index.html is missing the app name");
assert(index.includes("kokusiKaizouLearningStateV1"), "index.html is missing the dedicated localStorage key");
assert(index.includes("薬物名 → 作用機序"), "index.html is missing the pharmacology study mode label");
const embedded = index.match(/const EMBEDDED_CSV_BASE64 = "([^"]+)";/);
assert(embedded, "index.html is missing embedded CSV fallback");
const embeddedHeader = splitCsvLine(Buffer.from(embedded[1], "base64").toString("utf8").replace(/^\uFEFF/, "").split(/\r?\n/)[0]);
assert(requiredColumns.every((column) => embeddedHeader.includes(column)), "embedded CSV fallback has stale columns");

const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
assert(manifest.name === "国試対策 作用機序マスター カメラ改造版", "manifest name is not camera-mod specific");

const sw = readFileSync("sw.js", "utf8");
assert(sw.includes('"kokusi-kaizou-v1"'), "service worker cache name is not isolated");

console.log(`Verified ${lines.length - 1} pharmacology cards.`);
