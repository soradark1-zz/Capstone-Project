import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4f78b6',
      main: '#144d86',
      dark: '#002659',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#2ba0f4',
      main: '#73d1ff',
      dark: '#0072c1',
      contrastText: '#000000',
    },
    type: 'dark'
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root"));
registerServiceWorker();
