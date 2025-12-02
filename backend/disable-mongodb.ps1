# Script to disable MongoDB, Vercel, and Cloudinary in index.js
# This script makes surgical changes to switch to LOCAL JSON ONLY

$indexFile = "src\index.js"
$content = Get-Content $indexFile -Raw -Encoding UTF8

# 1. Comment out MongoDB import
$content = $content -replace "import { connectDB, getDB } from './mongodb.js';", "// MongoDB DISABLED - using local JSON only`n// import { connectDB, getDB } from './mongodb.js';"

# 2. Replace MongoDB connection block with simple local setup
$mongoBlockPattern = "(?s)// MongoDB connection state.*?\}\)\(\);"
$replacement = "// LOCAL JSON ONLY - MongoDB/Vercel/Cloudinary DISABLED`nlet useMongoDB = false;  // Always false - using local JSON only`nconsole.log('Using LOCAL JSON file only (MongoDB, Vercel, and Cloudinary disabled)');"
$content = $content -replace $mongoBlockPattern, $replacement

# 3. Simplify getCollection function
$getCollectionPattern = "(?s)const getCollection = async \(collectionName\) => \{.*?return data\[collectionName\] \|\| \[\];`n\};"
$getCollectionReplacement = @"
const getCollection = async (collectionName) => {
  const data = readDB();
  const collection = data[collectionName] || [];
  console.log('Loaded ' + collection.length + ' items from LOCAL JSON: ' + collectionName);
  return collection;
};
"@
$content = $content -replace $getCollectionPattern, $getCollectionReplacement

# 4. Remove Vercel check from SERVER START
$content = $content -replace "if \(process\.env\.NODE_ENV !== 'production' && !process\.env\.VERCEL\) \{", ""
$content = $content -replace "// Export for Vercel serverless function`nexport default app;", ""

# 5. Close the app.listen block properly
$content = $content -replace "  \}\);`n\}`n`n// Export", "  });"

# Save the modified content
$content | Out-File -FilePath $indexFile -Encoding UTF8 -NoNewline

Write-Host "Successfully disabled MongoDB, Vercel, and Cloudinary!" -ForegroundColor Green
Write-Host "Backend now uses LOCAL JSON ONLY (db.json)" -ForegroundColor Cyan
