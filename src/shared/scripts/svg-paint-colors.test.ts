import { describe, expect, it } from "vitest";

import { hasMultiplePaintColors } from "./svg-paint-colors.mjs";

describe("hasMultiplePaintColors", () => {
  it("fill과 stroke 속성의 서로 다른 색상을 감지한다", () => {
    const svg = '<svg><path fill="#98c95c" stroke="#fff" /></svg>';

    expect(hasMultiplePaintColors(svg)).toBe(true);
  });

  it("인라인 스타일의 서로 다른 색상을 감지한다", () => {
    const svg = '<svg><path style="fill: #98c95c; stroke: #fff" /></svg>';

    expect(hasMultiplePaintColors(svg)).toBe(true);
  });

  it("style 태그의 서로 다른 색상을 감지한다", () => {
    const svg = `
      <svg>
        <style>
          .background { fill: #98c95c; }
          .symbol { fill: #fff; }
        </style>
      </svg>
    `;

    expect(hasMultiplePaintColors(svg)).toBe(true);
  });

  it("동일한 색상과 색상 제어 값은 다색으로 판단하지 않는다", () => {
    const svg = `
      <svg fill="none">
        <path fill="#98c95c" />
        <path style="fill: #98C95C; stroke: currentColor" />
        <path stroke="url(#gradient)" />
      </svg>
    `;

    expect(hasMultiplePaintColors(svg)).toBe(false);
  });
});
