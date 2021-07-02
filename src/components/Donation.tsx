import { makeStyles, Typography } from '@material-ui/core';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
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

export default function Donation(): JSX.Element {
  const classes = useStyles(viewerTheme);
  return (
    <div className={classes.donation}>
      <FlashOnIcon className={classes.linkIcon} />
      <Typography variant="body1">
        <a
          href="https://etherscan.io/address/0x8d26c9dac7e16738752fa1446b956a97c63e2f39"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          jintao.eth
        </a>
      </Typography>
      <FlashOnIcon className={classes.linkIcon} />
    </div>
  );
}
