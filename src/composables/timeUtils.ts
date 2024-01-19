import { format } from "date-fns";

const formatDate = (
  dateString: string,
  formatString: string = "EEEE, MMMM d",
  locale: string = "en-US",
): string => {
  const date = new Date(dateString);
  return format(date, formatString);
};

export { formatDate };
