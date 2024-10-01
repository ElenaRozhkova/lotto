import React, { useState, useEffect } from 'react';
import { selectDatesApi } from './constants/api'

const DateDropdown = ({ selectedDate, setSelectedDate, viewHistoryDate }) => {
    const [dates, setDates] = useState([]);
    useEffect(() => {
        selectDatesApi(setDates)
    }, []);

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        viewHistoryDate(newDate);
    };

    return (
        <div>
            <select value={selectedDate} onChange={handleDateChange}>
                <option value="">Select Date</option>
                {dates.map((date, index) => (
                    <option key={index} value={date}>
                        {date}
                    </option>
                ))}
            </select>
            {selectedDate && <p>Выбранная дата: {selectedDate}</p>}
        </div>
    );
};

export default DateDropdown;