import '@fontsource/acme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Viewer from './Viewer';
import { viewerTheme } from './viewer.utils';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={viewerTheme}>
      <CssBaseline />
      <Viewer />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
