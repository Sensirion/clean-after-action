const core = require("@actions/core");
const io = require("@actions/io");
const { readdir } = require("node:fs/promises");

function getBoolValue(name) {
  return ["true", "1", "yes", "y"].includes(
    core.getInput(name).trim().toLowerCase()
  );
}

function formatError(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    return JSON.stringify(error);
  }

  return String(error);
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
  .catch((error) => {
    const message = formatError(error);
    core.setFailed(message);
  });
