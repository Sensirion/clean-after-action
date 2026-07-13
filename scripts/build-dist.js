const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const nccCli = require.resolve("@vercel/ncc/dist/ncc/cli");

function bundle(entryFile, outputFile) {
  const tempDir = path.join(distDir, `${path.basename(outputFile, ".js")}-tmp`);
  const outputPath = path.join(distDir, outputFile);

  execFileSync(process.execPath, [nccCli, "build", entryFile, "-o", tempDir], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  fs.renameSync(path.join(tempDir, "index.js"), outputPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

bundle("index.js", "main.js");
bundle("cleanup.js", "cleanup.js");
