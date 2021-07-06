import '@fontsource/acme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import ReactDOM from 'react-dom';
import store from './store/RootStore';
import { StoreProvider } from './store/StoreContext';
import Viewer from './Viewer';
import { viewerTheme } from './viewer.utils';

ReactDOM.render(
  <StoreProvider value={store}>
    <ThemeProvider theme={viewerTheme}>
      <CssBaseline />
      <Viewer />
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById('root'),
);
