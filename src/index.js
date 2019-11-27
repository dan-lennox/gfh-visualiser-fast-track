import React from 'react';
import ReactDOM from 'react-dom';
import { decodeHTML } from 'gfh-js-utilities';
import './sass/app.scss';
import 'materialize-css/sass/materialize.scss';
import 'materialize-css';
import 'gfh-react-components/index.css';

import App from './App';

const domContainer = document.querySelector('#colour-visualiser');
const props = JSON.parse(decodeHTML(domContainer.getAttribute('data-react-props')));
ReactDOM.render(React.createElement(App, props), domContainer);
