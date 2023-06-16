export const truncatedString = (str: string) => {
  if (!str) return "";
  return (
    str.substring(0, 7) + "..." + str.substring(str.length - 5, str.length)
  );
};
