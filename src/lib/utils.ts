export const formatDate = (raw: Date | string | null | undefined) => {
  if (!raw) return "Invalid date";
  return new Date(raw).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
