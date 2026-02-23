#!/usr/bin/env node
/**
 * Partytown Deprecation Warning Patch
 * 
 * This script patches Partytown library files to suppress deprecation warnings
 * for SharedStorage and AttributionReporting APIs that are triggered during
 * Lighthouse/PageSpeed Insights audits.
 * 
 * The issue is tracked in the Partytown repository:
 * - https://github.com/QwikDev/partytown/issues/693
 * - https://github.com/QwikDev/partytown/issues/694
 * 
 * These APIs are part of Chrome's Privacy Sandbox initiative and are being
 * deprecated. The warnings appear because Partytown's sandbox property
 * enumeration inadvertently accesses these deprecated APIs.
 * 
 * This patch adds these API names to the isValidMemberName filter function
 * so they are excluded from property enumeration.
 */

const fs = require('fs');
const path = require('path');

const PARTY_TOWN_DIR = path.join(__dirname, '..', 'public', '~partytown');

// Define the patches for each file
const patches = [
  {
    file: 'partytown-sw.js',
    find: 's=e=>!(i(e,"webkit")||i(e,"toJSON")||i(e,"constructor")||i(e,"toString")||i(e,"_"))',
    replace: 's=e=>!(i(e,"webkit")||i(e,"toJSON")||i(e,"constructor")||i(e,"toString")||i(e,"_")||"sharedStorage"===e||"attributionReporting"===e||"SharedStorage"===e||"AttributionReporting"===e)'
  },
  {
    file: 'partytown-atomics.js',
    find: 's=e=>!(i(e,"webkit")||i(e,"toJSON")||i(e,"constructor")||i(e,"toString")||i(e,"_"))',
    replace: 's=e=>!(i(e,"webkit")||i(e,"toJSON")||i(e,"constructor")||i(e,"toString")||i(e,"_")||"sharedStorage"===e||"attributionReporting"===e||"SharedStorage"===e||"AttributionReporting"===e)'
  },
  {
    file: path.join('debug', 'partytown-sandbox-sw.js'),
    find: 'const isValidMemberName = memberName => !(startsWith(memberName, "webkit") || startsWith(memberName, "toJSON") || startsWith(memberName, "constructor") || startsWith(memberName, "toString") || startsWith(memberName, "_"));',
    replace: 'const isValidMemberName = memberName => !(startsWith(memberName, "webkit") || startsWith(memberName, "toJSON") || startsWith(memberName, "constructor") || startsWith(memberName, "toString") || startsWith(memberName, "_") || memberName === "sharedStorage" || memberName === "attributionReporting" || memberName === "SharedStorage" || memberName === "AttributionReporting");'
  }
];

console.log('🔧 Applying Partytown patches...\n');

let appliedCount = 0;
let skippedCount = 0;

for (const patch of patches) {
  const filePath = path.join(PARTY_TOWN_DIR, patch.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped: ${patch.file} (file not found)`);
    skippedCount++;
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already patched
  if (content.includes('sharedStorage') || content.includes('attributionReporting')) {
    console.log(`✅ Already patched: ${patch.file}`);
    appliedCount++;
    continue;
  }
  
  if (content.includes(patch.find)) {
    content = content.replace(patch.find, patch.replace);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Patched: ${patch.file}`);
    appliedCount++;
  } else {
    console.log(`⚠️  Pattern not found in: ${patch.file}`);
    skippedCount++;
  }
}

console.log(`\n📊 Summary: ${appliedCount} patched, ${skippedCount} skipped`);
console.log('🎉 Partytown deprecation warning patch applied successfully!\n');
