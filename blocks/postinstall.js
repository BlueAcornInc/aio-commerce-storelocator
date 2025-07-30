const fs = require("fs");
const path = require("path");

function copyDirectorySync(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function findBlocksDirectory() {
  let currentDir = process.cwd();
  const startDir = currentDir;

  // Walk up the directory tree to find a blocks directory
  while (currentDir !== path.dirname(currentDir)) {
    const blocksPath = path.join(currentDir, "blocks");

    // Check if blocks directory exists and we're not in the source package directory
    if (fs.existsSync(blocksPath) && fs.statSync(blocksPath).isDirectory()) {
      // Make sure we're not trying to install into ourselves
      if (currentDir !== startDir && currentDir !== __dirname) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

function installBlocks() {
  console.log("Installing Store Locator blocks...");

  const packageDir = __dirname;
  const projectRoot = findBlocksDirectory();

  if (!projectRoot) {
    console.error("Error: Could not find a blocks/ directory in the project");
    console.error(
      "Please ensure you are installing this package in a project that has a blocks/ directory",
    );
    process.exit(1);
  }

  const sourceBlocksDir = packageDir;
  const targetBlocksDir = path.join(projectRoot, "blocks");

  // Safety check: ensure we're not trying to copy into ourselves
  if (path.resolve(sourceBlocksDir) === path.resolve(targetBlocksDir)) {
    console.log("✓ Already installed in correct location. No action needed.");
    return;
  }

  // Safety check: ensure target is not a subdirectory of source
  const relativePath = path.relative(sourceBlocksDir, targetBlocksDir);
  if (!relativePath.startsWith("..")) {
    console.error("Error: Cannot install into a subdirectory of the package");
    process.exit(1);
  }

  try {
    // Ensure target blocks directory exists
    if (!fs.existsSync(targetBlocksDir)) {
      fs.mkdirSync(targetBlocksDir, { recursive: true });
      console.log(`Created blocks directory: ${targetBlocksDir}`);
    }

    // Copy each subdirectory from the package blocks to the project blocks
    const entries = fs.readdirSync(sourceBlocksDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "node_modules") {
        const sourcePath = path.join(sourceBlocksDir, entry.name);
        const targetPath = path.join(targetBlocksDir, entry.name);

        // Check if target already exists
        if (fs.existsSync(targetPath)) {
          console.log(
            `Warning: Block '${entry.name}' already exists. Skipping...`,
          );
          console.log(
            `If you want to update, please remove the existing block first.`,
          );
          continue;
        }

        copyDirectorySync(sourcePath, targetPath);
        console.log(`✓ Installed block: ${entry.name}`);
      }
    }

    console.log("Store Locator blocks installation completed successfully!");
    console.log(`Blocks installed to: ${targetBlocksDir}`);
  } catch (error) {
    console.error("Error during installation:", error.message);
    process.exit(1);
  }
}

// Only run if this script is being executed directly (not required)
if (require.main === module) {
  installBlocks();
}

module.exports = { installBlocks, copyDirectorySync, findBlocksDirectory };
