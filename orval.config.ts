const operationsCache = require("./tools/generate-api/orval.operations.json");

const generateOperations = () => {
  if (Object.keys(operationsCache).length === 0) {
    throw new Error(
      "You must pre-generate the operations before running Orval. Run: bun run generate:orval-config",
    );
  }
  return operationsCache;
};

// orval.config.js
module.exports = {
  backend: {
    hooks: {
      afterAllFilesWrite: "pnpm biome format --write",
    },
    input: {
      target: "./tools/generate-api/swagger.json",
    },
    output: {
      clean: true,
      client: "react-query",
      fileExtension: ".api.ts",
      mode: "tags-split",
      override: {
        mutationOptions: {
          options: {
            onSuccess: {
              invalidate: ["entity"],
              notification: "success",
            },
          },
        },
        mutator: {
          name: "customInstance",
          path: "./src/api/orval.instance.ts",
        },
        operations: generateOperations(),
      },
      schemas: "src/api/generated/model",
      target: "src/api/generated/api",
    },
  },
};
