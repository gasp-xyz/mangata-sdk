export const isInputValid = (value) => {
    const valueNum = +value;
    return !(!value || isNaN(Number(value)) || isNaN(valueNum) || valueNum < 0);
};
