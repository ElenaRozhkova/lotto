import React from 'react';

export const FormCountDaten = ({ anzahlFehler, setAnzahlFehler }) => {


    const handleChange = (event) => {
        setAnzahlFehler(event.target.value);
    };
    return (
        <>
            <form style={{ paddingBottom: '20px' }}>
                <label style={{ marginRight: '20px' }} htmlFor="numberInput"> Rows Count</label>
                <input
                    id="numberInput"
                    type="number"
                    value={anzahlFehler}
                    onChange={handleChange}
                    required
                />
            </form>
        </>
    )
}