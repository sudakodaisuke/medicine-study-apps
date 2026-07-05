import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(path) {
  return readFileSync(path, "utf8");
}

const pediatricIndex = read("apps/pediatric-dose/index.html");
const pediatricManifest = JSON.parse(read("apps/pediatric-dose/manifest.webmanifest"));
const pediatricSw = read("apps/pediatric-dose/sw.js");

assert(pediatricIndex.includes("小児+先発後発 カメラ改造版"), "pediatric-dose app name is missing");
assert(pediatricIndex.includes("pediatricDoseCameraModLearningStateV1"), "pediatric-dose localStorage key is not isolated");
assert(pediatricManifest.name === "小児+先発後発 カメラ改造版", "pediatric-dose manifest name is wrong");
assert(pediatricSw.includes('"pediatric-dose-camera-mod-v1"'), "pediatric-dose cache name is wrong");

const sayoukijoIndex = read("apps/sayoukijo-master/index.html");
const sayoukijoManifest = JSON.parse(read("apps/sayoukijo-master/manifest.webmanifest"));
const sayoukijoSw = read("apps/sayoukijo-master/sw.js");

assert(sayoukijoIndex.includes("国試対策 作用機序マスター カメラ改造版"), "sayoukijo-master app name is missing");
assert(sayoukijoIndex.includes("kokusiKaizouLearningStateV1"), "sayoukijo-master localStorage key is not isolated");
assert(sayoukijoManifest.name === "国試対策 作用機序マスター カメラ改造版", "sayoukijo-master manifest name is wrong");
assert(sayoukijoSw.includes('"kokusi-kaizou-v1"'), "sayoukijo-master cache name is wrong");

console.log("Verified medicine-study-apps monorepo.");
