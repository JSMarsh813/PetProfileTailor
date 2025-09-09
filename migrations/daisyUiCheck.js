// filename: find-daisyui-classes.js
const fs = require("fs");
const path = require("path");

const foldersToScan = ["./pages", "./components"];
const daisyClasses = [
  "btn",
  "btn-primary",
  "btn-secondary",
  "card",
  "alert",
  "badge",
  "input",
  "dropdown",
  "modal",
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  daisyClasses.forEach((cls) => {
    const regex = new RegExp(`\\b${cls}\\b`, "g");
    if (regex.test(content)) {
      console.log(`${filePath}: contains "${cls}"`);
    }
  });
}

function scanFolder(folderPath) {
  fs.readdirSync(folderPath).forEach((item) => {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scanFolder(fullPath);
    } else if (stats.isFile() && /\.(js|ts|jsx|tsx|html)$/.test(item)) {
      scanFile(fullPath);
    }
  });
}

// Run scan
foldersToScan.forEach(scanFolder);
