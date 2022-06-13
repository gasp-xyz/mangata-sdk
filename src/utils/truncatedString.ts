export const truncatedString = (str: string) => {
  if (!str) return "";
  const len = str.length;
  return str.substring(0, 7) + "..." + str.substring(len - 5, len);
};
