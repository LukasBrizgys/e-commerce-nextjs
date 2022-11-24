const getNumber = (value : string | undefined, defaultValue :any) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num
}
export default getNumber;