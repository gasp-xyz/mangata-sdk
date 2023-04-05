export const truncatedString = (str) => {
    if (!str)
        return "";
    const len = str.length;
    return str.substring(0, 7) + "..." + str.substring(len - 5, len);
};
