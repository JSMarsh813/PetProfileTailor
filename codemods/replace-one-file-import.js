/**
 * Codemod to replace ../ReusableSmallComponents/... imports
 * with @components/...
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ImportDeclaration).forEach((path) => {
    let importPath = path.node.source.value;

    if (
      typeof importPath === "string" &&
      importPath.includes("ReusableSmallComponents")
    ) {
      // Replace the relative path with @components
      const newPath = importPath.replace(
        /(\.\.\/)+ReusableSmallComponents/,
        "@components",
      );

      path.node.source.value = newPath;
    }
  });

  return root.toSource({ quote: "double" });
}
