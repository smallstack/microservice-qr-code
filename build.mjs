import { build } from "esbuild";

// Bunny Edge Scripting runs on a Deno-based runtime. It accepts a single file
// (uploaded as `mod.ts`) and only allows `https://` and `node:` import
// specifiers. This bundle inlines the qr-image dependency, leaves the BunnySDK
// URL untouched, and rewrites Node built-in imports to use the `node:` prefix
// so they resolve at runtime.
const nodeBuiltins = new Set(["stream", "zlib", "buffer", "util", "events"]);

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  mainFields: ["module", "main"],
  conditions: ["import", "default"],
  banner: {
    js: [
      "import { createRequire as __cr } from 'node:module';",
      "import { Buffer } from 'node:buffer';",
      "const require = __cr(import.meta.url);",
      "globalThis.Buffer ??= Buffer;",
    ].join("\n"),
  },
  plugins: [
    {
      name: "node-builtins-and-https-external",
      setup(build) {
        build.onResolve({ filter: /^https:\/\// }, (args) => ({
          path: args.path,
          external: true,
        }));
        build.onResolve({ filter: /.*/ }, (args) => {
          if (nodeBuiltins.has(args.path)) {
            return { path: `node:${args.path}`, external: true };
          }
          return null;
        });
      },
    },
  ],
});
