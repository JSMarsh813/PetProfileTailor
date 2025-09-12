/**
 * Codemod to replace ../ReusableSmallComponents/... imports
 * with @components/...
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ImportDeclaration).forEach((path) => {
    let importPath = path.node.source.value;

    if (importPath.includes("Flagging")) {
      // Replace relative path up to ReusableSmallComponents with @components
      importPath = importPath.replace(
        /(\.\.\/)+Flagging/,
        "@components/Flagging",
      );

      // Keep the rest of the path (e.g., /ProfileImage)
      path.node.source.value = importPath;
    }
  });

  return root.toSource({ quote: "double" });
}
