import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { colorSemanticToken, colorToken } from "../../styles";
import { globalStyles } from "../global";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  cssVarsPrefix: "sd",

  globalCss: globalStyles,

  theme: {
    tokens: {
      colors: colorToken,
    },
    semanticTokens: {
      colors: colorSemanticToken,
    },
  },
});

export const system = createSystem(defaultConfig, config);
