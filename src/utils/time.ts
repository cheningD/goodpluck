import { format } from "date-fns";

const formatDate = (date: Date | undefined): string => {
  if (date === undefined) return "undefined";
  return format(date, "EEEE, MMMM d");
};

export { formatDate };
