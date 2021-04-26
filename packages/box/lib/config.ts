import fse from "fs-extra";
import { boxConfig } from "typings";

function setDefaults(config: any = {}): boxConfig {
  const hooks = config.hooks || {};

  return {
    ignore: config.ignore || [],
    commands: config.commands || {
      compile: "platon-truffle compile",
      migrate: "platon-truffle migrate",
      test: "platon-truffle test"
    },
    hooks: {
      "post-unpack": hooks["post-unpack"] || ""
    }
  };
}

function read(path: string): Promise<boxConfig> {
  return fse
    .readFile(path)
    .catch(() => "{}")
    .then(JSON.parse)
    .then(setDefaults);
}

export = {
  read,
  setDefaults
};
