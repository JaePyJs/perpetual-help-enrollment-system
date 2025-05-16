const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Create memory-bank HTML directory if it doesn't exist
const htmlDir = path.join(__dirname, 'memory-bank');
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}

// Style for the HTML files
const style = `
<style>
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #e77f33;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  h1 {
    font-size: 2.5em;
    border-bottom: 2px solid #e77f33;
    padding-bottom: 0.2em;
  }
  h2 {
    font-size: 1.8em;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.2em;
  }
  h3 {
    font-size: 1.5em;
  }
  a {
    color: #e77f33;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  pre {
    background-color: #f0f0f0;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }
  code {
    font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  blockquote {
    border-left: 4px solid #e77f33;
    padding-left: 1em;
    margin-left: 0;
    color: #666;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  ul, ol {
    padding-left: 2em;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
  }
  .header a {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: #e77f33;
    color: white;
    border-radius: 4px;
    text-decoration: none;
  }
  .header a:hover {
    background-color: #d06a20;
  }
</style>
`;

// Function to convert markdown to HTML
function convertMarkdownToHtml(mdFilePath, htmlFilePath) {
  try {
    const mdContent = fs.readFileSync(mdFilePath, 'utf8');
    const htmlContent = marked.parse(mdContent);
    
    const fileName = path.basename(mdFilePath, '.md');
    const title = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - School Enrollment System</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  ${style}
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <a href="/">Back to Navigation</a>
  </div>
  ${htmlContent}
</body>
</html>
    `;
    
    fs.writeFileSync(htmlFilePath, fullHtml);
    console.log(`Converted ${mdFilePath} to ${htmlFilePath}`);
  } catch (error) {
    console.error(`Error converting ${mdFilePath}: ${error.message}`);
  }
}

// Get all markdown files in the memory-bank directory
const mdDir = path.join(__dirname, 'memory-bank');
const mdFiles = fs.readdirSync(mdDir).filter(file => file.endsWith('.md'));

// Convert each markdown file to HTML
mdFiles.forEach(mdFile => {
  const mdFilePath = path.join(mdDir, mdFile);
  const htmlFilePath = path.join(htmlDir, mdFile.replace('.md', '.html'));
  convertMarkdownToHtml(mdFilePath, htmlFilePath);
});

console.log('All markdown files converted to HTML');
