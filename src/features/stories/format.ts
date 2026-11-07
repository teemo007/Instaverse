import moment from "moment";

export const parseTags = (tags?: string): string[] =>
  (tags ?? "")
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#+/, ""))
    .filter(Boolean);

export const shortTime = (date: string): string => {
  const then = moment(date);
  const minutes = moment().diff(then, "minutes");
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / (60 * 24))}d`;
  if (minutes < 60 * 24 * 7 * 52) return `${Math.floor(minutes / (60 * 24 * 7))}w`;
  return then.format("MMM D, YYYY");
};
