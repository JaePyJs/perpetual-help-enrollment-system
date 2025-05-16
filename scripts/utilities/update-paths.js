/**
 * Script to update import paths in the frontend code
 * This script replaces all occurrences of "enrollment-system (1)" with "enrollment-frontend"
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to recursively find files
function findFiles(dir, pattern, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== "node_modules" && file !== ".next") {
      findFiles(filePath, pattern, callback);
    } else if (stat.isFile() && pattern.test(file)) {
      callback(filePath);
    }
  }
}

// Function to update file content
function updateFileContent(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace old paths with new paths if needed
    const updatedContent = content.replace(
      /enrollment-system \(1\)/g,
      "enrollment-frontend"
    );

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, "utf8");
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log("Updating import paths...");

  // Find all TypeScript, JavaScript, JSON, and config files
  const pattern = /\.(ts|tsx|js|jsx|json|config)$/;

  // Update files in the enrollment-frontend directory
  findFiles("enrollment-frontend", pattern, updateFileContent);

  console.log("Import paths updated successfully!");
}

main();
