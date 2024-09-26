import './App.css';
import React, { useEffect } from 'react'
import { Table } from './Table';
import { NewTable } from './NewTable';
import { FormCountDaten } from './FormCountDaten';



import { ContentLayout } from './ContentLayout'
import { useState } from 'react'

function App() {
  const img = 'https://www.lotto.de/assets/images/logo-eurojackpot.svg?v=1920f0b326b';
  const text = 'Statistik'

  const [newZahlen, setNewZahlen] = useState(false);
  const [newData, setNewData] = useState([
    { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', col8: '' },
  ]);

  const [messageError, setMessageError] = useState('');
  const [anzahl, setAnzahl] = useState(10);

  const [data, setData] = useState(
    [
      { /*col1: '9', col2: '17', col3: '19', col4: '26', col5: '39', col6: '4', col7: '10' },
      { col1: '9', col2: '17', col3: '19', col4: '26', col5: '39', col6: '4', col7: '10' },
      { col1: '9', col2: '17', col3: '19', col4: '26', col5: '39', col6: '4', col7: '10' */},
    ]
  );
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
  }

  const transformData = (inputArray) => {
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

  useEffect(() => {
    fetch(`http://192.168.0.158:80/get_numbers?length=${anzahl}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Данные получены:", data.output);
        const transformedData = transformData(data.output);
        console.log("Данные получены новые :", transformedData);
        setData(transformedData);
        // Обработка полученных данных
      })
      .catch(error => {
        console.error("Произошла ошибка при запросе:", error);
      });
  }, [anzahl]);




  const columns = React.useMemo(
    () => [
      { Header: ' 1', accessor: 'col1' },
      { Header: ' 2', accessor: 'col2' },
      { Header: '3', accessor: 'col3' },
      { Header: '4', accessor: 'col4' },
      { Header: '5', accessor: 'col5' },
      { Header: '6', accessor: 'col6' },
      { Header: ' 7', accessor: 'col7' },
      { Header: ' 8', accessor: 'col8' },
    ],
    []
  )

  const btnNew = {
    marginTop: '40px',
    marginBottom: '40px',
    cursor: 'pointer'
  }
  const openNewZahlenContent = () => {
    setNewZahlen(!newZahlen)
  }

  const addNewZahlen = () => {

    const emptyValues = newData.map(row =>
      Object.values(row).some(value => value === '')
    );
    if (emptyValues.includes(true)) {
      setMessageError("Есть пустые значения");
      console.log("Есть пустые значения");
      return; // Прерываем выполнение функции, если есть пустые значения
    }

    setData(prevData => [...newData, ...prevData]);
    console.log('hier')
    console.log(newData)

    fetch('http://192.168.0.158:80/insert_numbers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData[0]),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Success:', result);
        // Обработка успешного ответа
      })
      .catch(error => {
        console.error('Error:', error);
        // Обработка ошибки
      });



    setNewData([{ col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', col7: '', col8: '' }]);
    setNewZahlen(true);
  }

  return (
    <div className="App">
      <div className='statistik'>
        <ContentLayout img={img} text={text}>
          <FormCountDaten anzahl={anzahl} setAnzahl={setAnzahl} />
          <Table columns={columns} data={data} />
          <button style={btnNew} onClick={openNewZahlenContent}> Neue Zahlen angeben</button>
        </ContentLayout>
      </div>

      <div className='newZahlen'>
        {newZahlen && (
          <ContentLayout img={img} text={'Neue Zahlen angeben'}>
            <NewTable columns={columns} data={newData} message={setMessageError} />
            <div className="messageError">{messageError}</div>
            <button style={btnNew} onClick={addNewZahlen}>Speichern</button>
          </ContentLayout>)}
      </div>
    </div>
  );
}

export default App;
