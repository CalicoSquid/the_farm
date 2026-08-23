const asString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeRelatedLinks = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => ({
      eyebrow: asString(item?.eyebrow),
      title: asString(item?.title),
      copy: asString(item?.copy),
      to: asString(item?.to),
      label: asString(item?.label),
    }))
    .filter((item) => item.title && item.to);
};

export const normalizeBlog = (id, data = {}) => {
  const likes = Number(data.likes);

  return {
    id,
    title: asString(data.title) || "Untitled update",
    date: data.date ?? null,
    imageUrl: asString(data.imageUrl),
    body: typeof data.body === "string" ? data.body : "",
    likes: Number.isFinite(likes) ? likes : 0,
    dek: asString(data.dek),
    excerpt: asString(data.excerpt),
    relatedLinks: normalizeRelatedLinks(data.relatedLinks),
  };
};

export const getBlogDate = (blog) => {
  const value = blog?.date;

  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getBlogTimestamp = (blog) => getBlogDate(blog)?.getTime() || 0;

export const stripBlogFormatting = (text = "") =>
  text
    .replace(/\/p\//g, " ")
    .replace(/\/br\//g, " ")
    .replace(/\/b\//g, "")
    .replace(/\[([^\]]+)\]\{[^}]+\}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export const getBlogExcerpt = (blog) =>
  blog?.excerpt || stripBlogFormatting(blog?.body || "");
