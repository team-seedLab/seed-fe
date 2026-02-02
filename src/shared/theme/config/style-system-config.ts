import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { globalStyles } from "../global";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  cssVarsPrefix: "ck",

  globalCss: globalStyles,
});

export const system = createSystem(defaultConfig, config);
