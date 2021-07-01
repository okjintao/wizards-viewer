import { Container, makeStyles, Typography } from '@material-ui/core';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import React from 'react';
import { WizardBar } from './components/WizardBar';
import WizardList from './components/WizardList';
import { AppStore } from './interface/app-store.interface';
import { InfoStore } from './store/InfoStore';
import { RankStore } from './store/RankStore';
import { viewerTheme } from './viewer.utils';

const useStyles = makeStyles((theme) => ({
  siteContainer: {
    backgroundImage: `url(./assets/wizard_bg.png)`,
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#007872',
    paddingBottom: '520px',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
  },
  donation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(-10),
  },
  link: {
    textDecoration: 'none',
    color: '#e0decc',
  },
  linkIcon: {
    height: '15px',
    width: '15px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export const store: AppStore = {
  ranks: new RankStore(),
  info: new InfoStore(),
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
      <div className={classes.donation}>
        <FlashOnIcon className={classes.linkIcon} />
        <Typography variant="body1">
          <a
            href="https://etherscan.io/address/0xbb2281ca5b4d07263112604d1f182ad0ab26a252"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            jintao.eth
          </a>
        </Typography>
        <FlashOnIcon className={classes.linkIcon} />
      </div>
    </>
  );
}
