#!/usr/bin/env node

const { Util } = require("@serverless-stack/core");
const { DebugApp, DebugStack } = require("@serverless-stack/resources");

const name = process.argv[2];
const stage = process.argv[3];
const region = process.argv[4];
const appBuildLibPath = process.argv[6];

// Load environment variables from dotenv
Util.Environment.load({
  searchPaths: [`.env.${stage}.local`, `.env.${stage}`],
});

// Validate the `debugStack` option in user SST app's index
const handler = require(appBuildLibPath);
if (handler.debugStack) {
  console.error(`Error: Use of the "debugStack()" callback to configure the debug stack has been deprecated in favor of the "debugApp()" callback.\n\nMore details on using "debugApp()": https://github.com/serverless-stack/serverless-stack/releases/tag/v0.65.3\n`);
  process.exit(1);
}

// Create CDK App
const app = new DebugApp({ name, stage, region });
if (handler.debugApp) {
  handler.debugApp(app);
}
else {
  new DebugStack(app, "debug-stack");
}
