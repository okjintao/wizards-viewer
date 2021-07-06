import { List, makeStyles, TablePagination, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import Socials from '../components/Socials';
import WizardListItem from '../components/WizardListItem';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      maxWidth: '98%',
      margin: 'auto',
    },
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const WizardList = observer(() => {
  const store = useContext(StoreContext);
  const classes = useStyles(viewerTheme);
  const isMobile = useMediaQuery(viewerTheme.breakpoints.down('sm'));
  const { ranks } = store;

  // pagination variables
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const start = page * pageSize;
  const end = (page + 1) * pageSize;

  useEffect(() => {
    setPage(0);
  }, [ranks.showUser]);

  return (
    <div className={classes.itemContainer}>
      <List dense>
        {ranks.wizards.slice(start, end).map((wizard) => (
          <WizardListItem key={wizard.idx} wizard={wizard} />
        ))}
      </List>
      <div className={clsx(classes.itemContainer, classes.centerContainer)}>
        <TablePagination
          labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
          component="div"
          count={ranks.wizards.length}
          page={page}
          rowsPerPage={pageSize}
          onChangePage={(_e, page) => setPage(page)}
          onChangeRowsPerPage={(e) => setPageSize(Number(e.target.value))}
        />
      </div>
      <div className={classes.centerContainer}>
        <Socials />
      </div>
    </div>
  );
});

export default WizardList;
