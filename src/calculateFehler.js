
export const calculateFehler = (newData, sollData) => {
    console.log("calculateFehler");
    const newDataFehler = newData.map((item) => ({
        col1: calculateDispersion1(item, sollData),
        col2: calculateDispersion2(item, sollData)
    }));
    console.log("newTableFehler" + newDataFehler);
    return newDataFehler;
};

export const calculateMaxValues = (data) => {
    return data.reduce((max, item) => ({
        maxCol1: Math.max(max.maxCol1, Number(item.col1) || 0),
        maxCol2: Math.max(max.maxCol2, Number(item.col2) || 0)
    }), { maxCol1: -Infinity, maxCol2: -Infinity });
};

export const calculateMinValues = (data) => {
    return data.reduce((min, item) => ({
        minCol1: Math.min(min.minCol1, Number(item.col1) || 0),
        minCol2: Math.min(min.minCol2, Number(item.col2) || 0)
    }), { minCol1: Infinity, minCol2: Infinity });
};


const calculateSquaredDifference = (value1, value2) => Math.pow(value1 - value2, 2);

const calculateDispersion1 = (item, sollData) => {
    let dispersion = 0;
    for (let i = 1; i <= 5; i++) {
        const col = `col${i}`;
        dispersion += calculateSquaredDifference(item[col], sollData[0][col]);
    }
    return Number((Math.sqrt(dispersion)).toFixed(2));
};
const calculateDispersion2 = (item, sollData) => {
    let dispersion = 0;
    for (let i = 6; i <= 7; i++) {
        const col = `col${i}`;
        dispersion += calculateSquaredDifference(item[col], sollData[0][col]);
    }
    return Number((Math.sqrt(dispersion)).toFixed(2));
};




