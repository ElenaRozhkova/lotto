
export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
}

export function formatDateToDB(dateString) {
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
}

export const transformData = (inputArray) => {
    return Object.entries(inputArray).map(([key, subArray]) => ({
        col1: subArray[0].toString(),
        col2: subArray[1].toString(),
        col3: subArray[2].toString(),
        col4: subArray[3].toString(),
        col5: subArray[4].toString(),
        col6: subArray[5].toString(),
        col7: subArray[6].toString(),
        col8: formatDate(subArray[7])
    }));
};