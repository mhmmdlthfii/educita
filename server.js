// server.js
// Main entry point for Node.js environments (like Hostinger) that expect a server.js file in the root.
// This loads the compiled production server.

import('./dist/server.cjs').catch(err => {
  console.error('Failed to load compiled server from ./dist/server.cjs');
  console.error('Please verify that the build has completed ("npm run build").');
  console.error(err);
  process.exit(1);
});
