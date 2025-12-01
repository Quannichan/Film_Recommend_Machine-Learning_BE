module.exports = {
  entry: ["src/index.js"],
  target: "node18",
  format: ["cjs"],
  sourcemap: true,
  splitting: false,
  clean: true,
  dts: false,
  minify: false,
  external: ["@prisma/client"],
};
