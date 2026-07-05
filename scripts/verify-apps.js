const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const apps = [
  {
    name: "syoni",
    appName: "\u5c0f\u5150+\u5148\u767a\u5f8c\u767a \u30ab\u30e1\u30e9\u6539\u9020\u7248",
    storageKey: "pediatricDoseCameraModLearningStateV1",
    cacheName: "pediatric-dose-camera-mod-v1",
  },
  {
    name: "kokushi",
    appName: "\u56fd\u8a66\u5bfe\u7b56 \u4f5c\u7528\u6a5f\u5e8f\u30de\u30b9\u30bf\u30fc \u30ab\u30e1\u30e9\u6539\u9020\u7248",
    storageKey: "kokusiKaizouLearningStateV1",
    cacheName: "kokusi-kaizou-v1",
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const app of apps) {
  const appRoot = path.join(root, "apps", app.name);

  for (const file of ["index.html", "data.csv", "manifest.webmanifest", "sw.js"]) {
    assert(fs.existsSync(path.join(appRoot, file)), `${app.name}: missing ${file}`);
  }

  const html = fs.readFileSync(path.join(appRoot, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(appRoot, "sw.js"), "utf8");
  const manifest = JSON.parse(fs.readFileSync(path.join(appRoot, "manifest.webmanifest"), "utf8"));

  assert(html.includes(app.appName), `${app.name}: app name is missing from index.html`);
  assert(html.includes(app.storageKey), `${app.name}: localStorage key is not isolated`);
  assert(sw.includes(app.cacheName), `${app.name}: service worker cache name is not isolated`);
  assert(manifest.name === app.appName, `${app.name}: manifest name is wrong`);

  const inlineScripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, script] of inlineScripts) {
    new Function(script);
  }

  console.log(`${app.name}: ok (${inlineScripts.length} inline script block${inlineScripts.length === 1 ? "" : "s"})`);
}

console.log("Verified medicine-study-apps monorepo.");
