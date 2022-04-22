import React from 'react';
import {createRoot} from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify'
import config from './aws-exports'
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(config)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
