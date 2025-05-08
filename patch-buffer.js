// patch-buffer.js - fixes compatibility with Node.js v24
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname, 
  'node_modules', 
  'buffer-equal-constant-time', 
  'index.js'
);

// Read the original file
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic code
content = content.replace(
  "var origSlowBufEqual = SlowBuffer.prototype.equal;",
  "var origSlowBufEqual = SlowBuffer && SlowBuffer.prototype ? SlowBuffer.prototype.equal : null;"
);

// Add a check before using origSlowBufEqual
content = content.replace(
  "SlowBuffer.prototype.equal = timeSafeEqual;",
  "if (SlowBuffer && SlowBuffer.prototype) { SlowBuffer.prototype.equal = timeSafeEqual; }"
);

// Write the patched file
fs.writeFileSync(filePath, content);

console.log('Successfully patched buffer-equal-constant-time for Node.js v24 compatibility');
