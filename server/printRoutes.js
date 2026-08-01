const app = require("./server");
console.log("=== REGISTERED ROUTES ===");
if (app._router && app._router.stack) {
  app._router.stack.forEach((layer) => {
    if (layer.route) {
      console.log(`Route: ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === 'router') {
      // Find matching path prefix if possible
      console.log(`Router mounted at regex: ${layer.regexp.toString()}`);
      if (layer.handle && layer.handle.stack) {
        layer.handle.stack.forEach((subLayer) => {
          if (subLayer.route) {
            console.log(`  SubRoute: ${Object.keys(subLayer.route.methods).join(', ').toUpperCase()} ${subLayer.route.path}`);
          } else {
            console.log(`  Middleware/Sub: ${subLayer.name}`);
          }
        });
      }
    }
  });
}
process.exit(0);
