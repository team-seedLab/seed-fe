const PAINT_ATTRIBUTE_PATTERN =
  /(?:^|[\s<])(?:fill|stroke)\s*=\s*["']([^"']+)["']/gi;
const PAINT_STYLE_PATTERN = /(?:^|[;{"'])\s*(?:fill|stroke)\s*:\s*([^;}"']+)/gi;

const normalizePaintColor = (color) =>
  color
    .replace(/\s*!important\s*$/i, "")
    .trim()
    .toLowerCase();

const isPaintColor = (color) =>
  color &&
  color !== "none" &&
  color !== "currentcolor" &&
  !color.startsWith("url(");

const getPaintColors = (svgContent) => {
  const attributeColors = Array.from(
    svgContent.matchAll(PAINT_ATTRIBUTE_PATTERN),
    ([, color]) => color,
  );
  const styleColors = Array.from(
    svgContent.matchAll(PAINT_STYLE_PATTERN),
    ([, color]) => color,
  );

  return [...attributeColors, ...styleColors]
    .map(normalizePaintColor)
    .filter(isPaintColor);
};

export const hasMultiplePaintColors = (svgContent) =>
  new Set(getPaintColors(svgContent)).size > 1;
