import React from 'react';
import ReactDom from 'react-dom';
import { Router, hashHistory } from 'react-router';

import routes from './routes';

const appContainer = document.getElementById('runrunTMApp');
const path = appContainer.getAttribute('path') || '';

ReactDom.render(
  <Router history={hashHistory} routes={routes(path)} />, 
  appContainer
)