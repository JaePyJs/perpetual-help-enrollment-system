/**
 * Script to update paths in the .next directory
 * This script replaces all occurrences of "enrollment-system (1)" with "enrollment-frontend"
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to recursively find files
function findFiles(dir, callback) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, callback);
    } else if (stat.isFile()) {
      callback(filePath);
    }
  }
}

// Function to update file content
function updateFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

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
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log("Updating paths in .next directory...");

  // Update files in the enrollment-frontend/.next directory
  findFiles("enrollment-frontend/.next", updateFileContent);

  console.log("Paths updated successfully!");
}

main();
