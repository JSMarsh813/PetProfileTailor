/**
 * Codemod to convert relative imports to @ aliases
 * Skips imports from pages/api
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Map folders to aliases
  const aliasMap = {
    components: "@components",
    utils: "@utils",
    hooks: "@hooks",
    context: "@context",
    models: "@models",
    pages: "@pages",
  };

  root.find(j.ImportDeclaration).forEach((path) => {
    let importPath = path.node.source.value;

    // Skip API routes
    if (typeof importPath === "string" && importPath.includes("pages/api"))
      return;

    // Only process relative imports (skip already aliased)
    if (
      typeof importPath === "string" &&
      importPath.startsWith(".") &&
      !importPath.startsWith("@")
    ) {
      for (const [folder, alias] of Object.entries(aliasMap)) {
        // Match any number of ../ or ./ before the folder
        const regex = new RegExp(`^(\\.\\./|\\.\\/)+${folder}`, "i");

        if (regex.test(importPath)) {
          importPath = importPath.replace(regex, alias);

          // Remove trailing slash for index imports
          if (importPath.endsWith("/")) {
            importPath = importPath.slice(0, -1);
          }

          path.node.source.value = importPath;
          break; // stop after first match
        }
      }
    }
  });

  return root.toSource({ quote: "double" });
}
