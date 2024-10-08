import { Table } from './Table';
import { FormCountDaten } from './FormCountDaten';
import { columns, columnsFehler, columnsOhneDate } from './constants/columns';
import React, { useState, useEffect, useCallback } from 'react';
import { calculateFehler, calculateMaxValues, calculateMinValues } from './calculateFehler'
import { ContentLayout } from './ContentLayout'
import { formatDate, transformData } from './constants/transformdata'
import { insertApi, allSelectApi, selectRowsFromDatumHistory, selectRowsFromDatumSuggest } from './constants/api'
import DateDropdown from './DateDropdown'

export const TabContainer = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [data, setData] = useState([{},]);
    const [newData, setNewData] = useState([
        { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', col8: '' },
    ]);

    const [isHovered, setIsHovered] = useState(false);
    const [newZahlen, setNewZahlen] = useState(false);
    const [maxD, setMaxD] = useState({ maxCol1: 0, maxCol2: 0 });
    const [minD, setMinD] = useState({ minCol1: 0, minCol2: 0 });
    const [fehlerBerechnen, setFehlerBerechnen] = useState(false);
    const [sollData, setSollData] = useState([
        { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '' },
    ]);
    const [tableFehler, setTableFehler] = useState([]);
    const [messageError, setMessageError] = useState('');
    const [anzahl, setAnzahl] = useState(10);
    const [anzahlFehler, setAnzahlFehler] = useState(2);
    const [selectedDate, setSelectedDate] = useState('');
    // const [data, setData] = useState([{},]);
    const [dataPrognose, setdataPrognose] = useState([]);
    const [dataSollHistory, setDataSollHistory] = useState([
        { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '' },
    ]);

    const [dataSollSuggest, setDataSollSuggest] = useState([
        { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '' },
    ]);

    useEffect(() => {
        const newData = Array.from({ length: anzahlFehler }, () => ({
            col1: '',
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: ''
        }));

        const newDataFehler = Array.from({ length: anzahlFehler }, () => ({
            col1: '',
            col2: ''
        }));

        setdataPrognose(newData);
        setTableFehler(newDataFehler);
    }, [anzahlFehler]);

    useEffect(() => {
        allSelectApi(setData);
    }, []);

    const btnNew = {

        backgroundColor: isHovered ? 'rgba(216, 221, 234, 0.8)' : 'rgba(216, 221, 234, 1)',
        color: '#000',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '20px 0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'opacity 0.3s ease',

    }

    const tabs = [
        { id: 'tab1', label: 'History' },
        { id: 'tab2', label: 'Validation' },
    ];
    const addNewZahlen = () => {
        const emptyValues = newData.map(row =>
            Object.values(row).some(value => value === '')
        );
        if (emptyValues.includes(true)) {
            setMessageError("Есть пустые значения");
            return; // Прерываем выполнение функции, если есть пустые значения
        }
        setData(prevData => [...newData, ...prevData]);
        insertApi(newData[0]);
        setNewData([{ col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', col8: '' }]);
        setNewZahlen(true);
    }


    const viewHistoryDate = (selectedDate) => {
        selectRowsFromDatumHistory(selectedDate, setDataSollHistory);
        selectRowsFromDatumSuggest(selectedDate, setDataSollSuggest);
        setTableFehler([]);
        setMaxD('');
        setMinD('');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'tab1':
                return <>
                    <ContentLayout text={'Insert Row'}>
                        <Table columns={columns} data={newData} message={setMessageError} />
                        <button style={btnNew}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={addNewZahlen}> Save </button>
                    </ContentLayout>
                    <ContentLayout text={'History'}>
                        <Table columns={columns} data={data} message={setMessageError} />
                        <div className="messageError">{messageError}</div>
                    </ContentLayout>
                </>;
            case 'tab2':
                return <div>
                    <ContentLayout text={'Validation'}>
                        <div className='table_container'>

                            <div className='table_left'>
                                <DateDropdown selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    viewHistoryDate={viewHistoryDate} ></DateDropdown>
                                <h4>History</h4>
                                <Table columns={columnsOhneDate} data={dataSollHistory} message={setMessageError} />

                                {/* <FormCountDaten anzahlFehler={anzahlFehler} setAnzahlFehler={setAnzahlFehler} />*/}
                                <button
                                    style={btnNew}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={() => {
                                        const newTableFehler = calculateFehler(dataSollSuggest, dataSollHistory);

                                        setTableFehler(newTableFehler);
                                        setMaxD(calculateMaxValues(newTableFehler));
                                        setMinD(calculateMinValues(newTableFehler));
                                    }}
                                >
                                    calculate error
                                </button>
                                <h4>Suggest</h4>
                                <div className='tablepr_left'>
                                    <Table columns={columnsOhneDate} data={dataSollSuggest} message={setMessageError} />
                                </div>

                            </div>
                            <div className='table_right'>
                                <Table columns={columnsFehler} data={tableFehler} />

                            </div>
                        </div>
                        <h4>Max: D1: {maxD.maxCol1}, D2: {maxD.maxCol2}</h4>
                        <h4 style={{ marginTop: '0' }}>Min: D1: {minD.minCol1}, D2: {minD.minCol2}</h4>

                        <div className="messageError">{messageError}</div>

                    </ContentLayout>
                </div>;
            default:
                return <div>Выберите вкладку</div>;
        }
    };

    return (
        <div className="tab-container">
            <nav className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

