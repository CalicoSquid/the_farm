export const getBlogDate = (blog) => {
  const value = blog?.date;

  if (!value) return new Date(0);
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};
