import { formatDateToDB, transformData } from "./transformdata";

export const insertApi = (data) => {
    fetch('http://192.168.0.158:80/insert_numbers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
        })
        .catch(error => {
        });
}

export const allSelectApi = (setData) => {
    return fetch(`http://192.168.0.158:80/get_numbers`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const transformedData = transformData(data.output);
            setData(transformedData);
        })
        .catch(error => {
            console.error("Произошла ошибка при запросе:", error);
        });
};

export const selectDatesApi = (setDates) => {
    return fetch(`http://192.168.0.158:80/get_dates`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setDates(data.output);
        })
        .catch(error => {
            console.error("Произошла ошибка при запросе:", error);
        });
};

export const selectAllSelectedDatumApi = (selectedDate, setDataSoll) => {
    const newDate = formatDateToDB(selectedDate)
    console.log('setDataSoll');
    console.log(newDate);
    return fetch(`http://192.168.0.158:80/get_number/${newDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            const transformedData = transformData(data.output);
            setDataSoll(transformedData);

        })
        .catch(error => {
            console.error("Произошла ошибка при запросе:", error);
        });
};