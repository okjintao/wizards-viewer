import { Container, makeStyles } from '@material-ui/core';
import Donation from './components/Donation';
import WizardBar from './components/WizardBar';
import WizardList from './components/WizardList';
import { AppStore } from './interface/app-store.interface';
import { InfoStore } from './store/InfoStore';
import { RankStore } from './store/RankStore';
import { UserStore } from './store/UserStore';
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

export const store: AppStore = {
  ranks: new RankStore(),
  info: new InfoStore(),
  user: new UserStore(),
};
export default function Viewer(): JSX.Element {
  const classes = useStyles(viewerTheme);

  return (
    <>
      <div className={classes.siteContainer}>
        <Container>
          <WizardBar />
          <WizardList />
        </Container>
      </div>
      <Donation />
    </>
  );
}
