import './App.css';
import React from 'react';
import { Header } from './Header';
import { TabContainer } from './TabContainer';

function App() {


  return (
    <div className="App">
      <Header />
      <TabContainer />
      <div className='newZahlen'>
      </div>
    </div>
  );
}

export default App;
