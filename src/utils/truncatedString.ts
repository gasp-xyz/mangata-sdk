export const truncatedString = (str: string, len: number) => {
  if (!str) return "";
  return str.substring(0, 7) + "..." + str.substring(len - 5, len);
};
