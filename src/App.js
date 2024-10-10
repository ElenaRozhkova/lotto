import './App.css';
import React from 'react';
import { Header } from './Header';
import { TabContainer } from './TabContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <div className="App">
      <Header />
      <TabContainer />
      <div className='newZahlen'>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
