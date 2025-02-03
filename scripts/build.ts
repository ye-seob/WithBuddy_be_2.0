import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  format: "cjs",
  outdir: "./build",
  outExtension: { ".js": ".cjs" },
  platform: "node",
  target: "node20",
  minify: true,
  keepNames: true,
});
