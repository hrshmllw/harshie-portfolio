/**
 * Plain-text paragraphs from a Nuxt Content body (minimark in Content v3,
 * with a fallback for the older `children` AST).
 */
type Node = string | unknown[] | { tag?: string; children?: Node[]; value?: string; type?: string };

const textOf = (node: Node): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) {
    // minimark: [tag, props, ...children]
    return (node.slice(2) as Node[]).map(textOf).join("");
  }
  if (node && typeof node === "object") {
    if (node.type === "text") return node.value ?? "";
    return (node.children ?? []).map(textOf).join("");
  }
  return "";
};

export function contentParagraphs(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];
  const b = body as { value?: unknown[]; children?: Node[] };

  if (Array.isArray(b.value)) {
    return b.value
      .filter((node): node is unknown[] => Array.isArray(node) && node[0] === "p")
      .map((node) => textOf(node).trim())
      .filter(Boolean);
  }

  return (b.children ?? [])
    .filter((node) => typeof node === "object" && !Array.isArray(node) && node.tag === "p")
    .map((node) => textOf(node).trim())
    .filter(Boolean);
}
