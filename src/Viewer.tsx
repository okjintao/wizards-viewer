import { Container, makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router } from 'react-router-dom';
import Donation from './components/Donation';
import Routes from './components/Routes';
import WizardBar from './components/WizardBar';
import { viewerTheme } from './viewer.utils';

const useStyles = makeStyles((theme) => ({
  siteContainer: {
    backgroundImage: `url(./assets/wizard_bg.png)`,
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'repeat-x',
    backgroundColor: '#007872',
    paddingBottom: '520px',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    minHeight: '100vh',
  },
}));

const Viewer = observer((): JSX.Element => {
  const classes = useStyles(viewerTheme);
  return (
    <>
      <div className={classes.siteContainer}>
        <Container>
          <Router>
            <WizardBar />
            <Routes />
          </Router>
        </Container>
      </div>
      <Donation />
    </>
  );
});

export default Viewer;
