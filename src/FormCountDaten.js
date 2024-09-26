import React from 'react';

export const FormCountDaten = ({ anzahl, setAnzahl }) => {


    const handleChange = (event) => {
        setAnzahl(event.target.value);
    };
    return (
        <>
            <form style={{ paddingBottom: '20px' }}>
                <label style={{ marginRight: '20px' }} htmlFor="numberInput">Datenanzahl: </label>
                <input
                    id="numberInput"
                    type="number"
                    value={anzahl}
                    onChange={handleChange}
                    required
                />
            </form>
        </>
    )
}