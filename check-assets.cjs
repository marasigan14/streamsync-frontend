// Lists every image/video imported in src/ that doesn't exist on disk.
const fs = require("fs");
const path = require("path");

const missing = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(jsx?|tsx?)$/.test(name)) {
      const code = fs.readFileSync(full, "utf8");
      const re = /from\s+["'](\.{1,2}\/[^"']+\.(?:png|jpe?g|gif|svg|webp|mp4|webm))["']/gi;
      for (const m of code.matchAll(re)) {
        const target = path.resolve(path.dirname(full), m[1]);
        if (!fs.existsSync(target)) missing.push(`${path.relative(".", target)}   (used in ${path.relative(".", full)})`);
      }
    }
  }
}
walk("src");
if (missing.length) {
  console.log(`${missing.length} missing file(s):`);
  missing.forEach((m) => console.log("  " + m));
} else {
  console.log("All imported images were found.");
}