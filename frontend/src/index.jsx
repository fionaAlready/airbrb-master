import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

window.onbeforeunload = function () {
  const storage = window.localStorage;
  storage.removeItem('publishKey')
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
