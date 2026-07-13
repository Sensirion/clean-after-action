const core = require("@actions/core");
const io = require("@actions/io");
const { readdir } = require("node:fs/promises");

function getBoolValue(name) {
  return ["true", "1", "yes", "y"].includes(
    core.getInput(name).trim().toLowerCase()
  );
}

async function main() {
  const keepGit = getBoolValue("keep-git");
  const files = await readdir(".");

  for (const file of files) {
    if (keepGit && file === ".git") {
      continue;
    }
    console.log(`Deleting ${file}`);
    await io.rmRF(file);
  }
}

main()
  .then(() => console.log("Finished"))
  .catch((error) =>
    core.setFailed(error instanceof Error ? error.message : String(error))
  );
