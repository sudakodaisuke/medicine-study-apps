const fs = require("fs");
const path = require("path");

const app = process.argv[2];
const allowedApps = new Set(["syoni", "kokushi"]);

if (!allowedApps.has(app)) {
    console.error("Usage: node scripts/copy-shared.js <syoni|kokushi>");
    process.exit(1);
}

const root = path.resolve(__dirname, "..");
const appRoot = path.join(root, "apps", app);
const sharedRoot = path.join(root, "shared");

function copyDir(source, destination) {
    if (!fs.existsSync(source)) return;
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
}

copyDir(path.join(sharedRoot, "assets"), path.join(appRoot, "assets"));

console.log(`shared assets copied to apps/${app}/assets`);
