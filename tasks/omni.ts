import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from "fs";
import * as path from "path";
import { processTemplates, sanitizeSolidityFunctionName } from "../lib";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  const templateDir = path.resolve(__dirname, "..", "templates", "omnichain");
  const outputDir = path.resolve(process.cwd());
  const argsList = args.arguments || [];
  const names = argsList.map((i: string) => i.split(":")[0]);
  const types = argsList.map((i: string) => {
    let parts = i.split(":");
    // If there's a type and it's not empty, use it; if not, default to "bytes32"
    let t =
      parts.length > 1 && parts[1].trim() !== "" ? parts[1].trim() : "bytes32";
    return t;
  });
  const pairs = names.map((v: string, i: string) => [v, types[i]]);

  const data = {
    args,
    contractName: sanitizeSolidityFunctionName(args.name),
    arguments: { names, types, pairs },
  };

  processTemplates(templateDir, outputDir, data);

  const configPath = path.resolve(process.cwd(), "hardhat.config.ts");
  let hardhatConfigContents = fs.readFileSync(configPath, "utf8");

  // Add the omnichain tasks to the hardhat.config.ts file
  ["deploy", "interact"].forEach((task) => {
    const content = `import "./tasks/${task}";\n`;
    if (!hardhatConfigContents.includes(content)) {
      hardhatConfigContents = content + hardhatConfigContents;
    }
  });

  fs.writeFileSync(configPath, hardhatConfigContents);
};

export const omniTask = task(
  "omni",
  "Generate code for an omnichain smart contract",
  main
)
  .addPositionalParam("name", "Name of the contract")
  .addOptionalVariadicPositionalParam(
    "arguments",
    "Arguments for a crosschain call (e.g. dest:address to:bytes32 output:uint256)"
  );
