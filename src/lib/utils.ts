export const formatDate = (raw: string) =>
  new Date(raw).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
