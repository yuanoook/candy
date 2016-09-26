import './style';

import React from 'react';
import ReactDom from 'react-dom';

import nihao from './component';
import aa from './app';

const body = React.createElement(aa,{bg:'green'},nihao);

ReactDom.render(body,document.getElementById('root'));