export const isInputValid = (value: string): boolean => {
  const valueNum = +value;

  return !(!value || isNaN(Number(value)) || isNaN(valueNum) || valueNum < 0);
};
