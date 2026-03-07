import fs from "node:fs";
import path from "node:path";
import { optimize } from "svgo";

const projectRoot = process.cwd();

const ICON_DIR = path.join(projectRoot, "src/shared/_assets/icons");
const IMPORT_PREFIX = "@/shared/_assets/icons";

const ICONS_INDEX = path.join(ICON_DIR, "index.ts");

function banner() {
  return `/**
 * 해당 파일은 자동으로 생성됩니다. 수동으로 수정하지 마세요.
 * shared/_assets/icons에서 SVG 파일을 추가/삭제한 후 'pnpm generate:icons'를 실행하세요.
 */
`;
}

function toKebab(file) {
  return file.replace(/\.svg$/i, "");
}

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function readSvgFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function optimizeSvg(filePath) {
  const svgContent = fs.readFileSync(filePath, "utf8");
  const result = optimize(svgContent, {
    path: filePath,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            convertColors: {
              currentColor: true, // fill/stroke 색상을 currentColor로 변환 → color prop으로 색상 제어 가능
            },
          },
        },
      },
      "removeDimensions", // width, height 제거 (viewBox만 사용)
    ],
  });

  if (result.data) {
    fs.writeFileSync(filePath, result.data, "utf8");
    return true;
  }
  return false;
}

function main() {
  ensureDir(ICON_DIR);

  const files = readSvgFiles(ICON_DIR);

  console.log("SVG 파일 최적화 중...");
  files.forEach((file) => {
    const filePath = path.join(ICON_DIR, file);
    optimizeSvg(filePath);
  });
  console.log(`총 ${files.length}개 파일 최적화 완료\n`);

  const iconImports = files
    .map((f) => {
      const pascal = toPascal(toKebab(f));
      return `import _${pascal}Icon from "${IMPORT_PREFIX}/${f}?react";`;
    })
    .join("\n");

  const iconExports = files
    .map((f) => {
      const pascal = toPascal(toKebab(f));
      return `export const ${pascal}Icon = createIcon(_${pascal}Icon, "${pascal}Icon");`;
    })
    .join("\n");

  fs.writeFileSync(
    ICONS_INDEX,
    `${banner()}
import { createIcon } from "@/shared/components/features/CreateIcon";

${iconImports}

${iconExports}
`,
    "utf8",
  );

  console.log(`아이콘 인덱스 파일 생성 완료:\n${ICONS_INDEX}`);
}

main();
