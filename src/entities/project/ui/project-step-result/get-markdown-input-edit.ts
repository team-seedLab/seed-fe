const MARKDOWN_INDENT = "    ";

type Params = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

type MarkdownInputEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type InlineSyntax = {
  prefix: string;
  suffix: string;
  selectSuffix?: boolean;
};

type ListLine = {
  content: string;
  indent: string;
  marker: string;
};

const INLINE_SYNTAX_BY_KEY: Record<string, InlineSyntax> = {
  b: { prefix: "**", suffix: "**" },
  i: { prefix: "*", suffix: "*" },
  k: { prefix: "[", selectSuffix: true, suffix: "](url)" },
};

const getListLine = (line: string): ListLine | null => {
  const bulletMatch = line.match(/^(\s*)([-+*])\s+(.*)$/);

  if (bulletMatch) {
    const [, indent, marker, content] = bulletMatch;

    return { content, indent, marker };
  }

  const orderedMatch = line.match(/^(\s*)(\d+)([.)])\s+(.*)$/);

  if (!orderedMatch) {
    return null;
  }

  const [, indent, number, delimiter, content] = orderedMatch;

  return {
    content,
    indent,
    marker: `${Number(number) + 1}${delimiter}`,
  };
};

const getInlineEdit = (
  params: Params,
  syntax: InlineSyntax,
): MarkdownInputEdit => {
  const selectedText = params.value.slice(
    params.selectionStart,
    params.selectionEnd,
  );
  const replacement = `${syntax.prefix}${selectedText}${syntax.suffix}`;
  const value = `${params.value.slice(0, params.selectionStart)}${replacement}${params.value.slice(params.selectionEnd)}`;

  if (syntax.selectSuffix) {
    const urlStart =
      params.selectionStart + syntax.prefix.length + selectedText.length + 2;

    return {
      selectionEnd: urlStart + 3,
      selectionStart: urlStart,
      value,
    };
  }

  return {
    selectionEnd: params.selectionEnd + syntax.prefix.length,
    selectionStart: params.selectionStart + syntax.prefix.length,
    value,
  };
};

const removeIndent = (line: string) => {
  if (line.startsWith("\t")) {
    return line.slice(1);
  }

  const indentLength = line.match(/^ {1,4}/)?.[0].length ?? 0;

  return line.slice(indentLength);
};

const getCursorIndentEdit = (params: Params): MarkdownInputEdit => {
  const value = `${params.value.slice(0, params.selectionStart)}${MARKDOWN_INDENT}${params.value.slice(params.selectionEnd)}`;
  const cursor = params.selectionStart + MARKDOWN_INDENT.length;

  return {
    selectionEnd: cursor,
    selectionStart: cursor,
    value,
  };
};

const getLineEdit = (params: Params): MarkdownInputEdit => {
  const lineStart =
    params.value.lastIndexOf("\n", params.selectionStart - 1) + 1;
  const selectionEndsAtLineStart =
    params.selectionEnd > params.selectionStart &&
    params.value[params.selectionEnd - 1] === "\n";
  const effectiveSelectionEnd = selectionEndsAtLineStart
    ? params.selectionEnd - 1
    : params.selectionEnd;
  const nextLineBreak = params.value.indexOf("\n", effectiveSelectionEnd);
  const lineEnd = nextLineBreak === -1 ? params.value.length : nextLineBreak;
  const selectedLines = params.value.slice(lineStart, lineEnd);
  const textBeforeCursor = params.value.slice(lineStart, params.selectionStart);
  const shouldEditWholeLines =
    params.selectionStart !== params.selectionEnd ||
    params.shiftKey ||
    /^[\t ]*$/.test(textBeforeCursor) ||
    Boolean(getListLine(selectedLines));

  if (!shouldEditWholeLines) {
    return getCursorIndentEdit(params);
  }

  const editedLines = selectedLines
    .split("\n")
    .map((line) =>
      params.shiftKey ? removeIndent(line) : `${MARKDOWN_INDENT}${line}`,
    )
    .join("\n");
  const value = `${params.value.slice(0, lineStart)}${editedLines}${params.value.slice(lineEnd)}`;

  if (params.selectionStart !== params.selectionEnd) {
    return {
      selectionEnd: lineStart + editedLines.length,
      selectionStart: lineStart,
      value,
    };
  }

  const changedLength = editedLines.length - selectedLines.length;
  const cursor = params.shiftKey
    ? Math.max(lineStart, params.selectionStart + changedLength)
    : params.selectionStart + MARKDOWN_INDENT.length;

  return {
    selectionEnd: cursor,
    selectionStart: cursor,
    value,
  };
};

const getListContinuationEdit = (params: Params): MarkdownInputEdit | null => {
  if (
    params.shiftKey ||
    params.ctrlKey ||
    params.metaKey ||
    params.selectionStart !== params.selectionEnd
  ) {
    return null;
  }

  const lineStart =
    params.value.lastIndexOf("\n", params.selectionStart - 1) + 1;
  const lineEndIndex = params.value.indexOf("\n", params.selectionEnd);
  const lineEnd = lineEndIndex === -1 ? params.value.length : lineEndIndex;
  const lineBeforeCursor = params.value.slice(lineStart, params.selectionStart);
  const lineAfterCursor = params.value.slice(params.selectionEnd, lineEnd);
  const listLine = getListLine(lineBeforeCursor);

  if (!listLine) {
    return null;
  }

  if (!listLine.content.trim() && !lineAfterCursor.trim()) {
    const valueBeforeLine = params.value.slice(0, lineStart);
    const valueAfterLine = params.value.slice(lineEnd);
    const needsBlockSeparator =
      Boolean(valueBeforeLine.trim()) &&
      !valueBeforeLine.endsWith("\n\n") &&
      !valueAfterLine.startsWith("\n");
    const blockSeparator = needsBlockSeparator ? "\n" : "";
    const cursor = valueBeforeLine.length + blockSeparator.length;

    return {
      selectionEnd: cursor,
      selectionStart: cursor,
      value: `${valueBeforeLine}${blockSeparator}${valueAfterLine}`,
    };
  }

  const nextPrefix = `${listLine.indent}${listLine.marker} `;
  const insertedText = `\n${nextPrefix}`;
  const cursor = params.selectionStart + insertedText.length;

  return {
    selectionEnd: cursor,
    selectionStart: cursor,
    value: `${params.value.slice(0, params.selectionStart)}${insertedText}${params.value.slice(params.selectionEnd)}`,
  };
};

export const getMarkdownInputEdit = (
  params: Params,
): MarkdownInputEdit | null => {
  if (params.key === "Tab" && !params.ctrlKey && !params.metaKey) {
    return getLineEdit(params);
  }

  if (params.key === "Enter") {
    return getListContinuationEdit(params);
  }

  if (!params.ctrlKey && !params.metaKey) {
    return null;
  }

  const syntax = INLINE_SYNTAX_BY_KEY[params.key.toLowerCase()];

  return syntax ? getInlineEdit(params, syntax) : null;
};
