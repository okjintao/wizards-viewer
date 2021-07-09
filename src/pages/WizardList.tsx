import { List, makeStyles, TablePagination, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import WizardDisplay from '../components/WizardDisplay';
import WizardListItem from '../components/WizardListItem';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    marginBottom: theme.spacing(4),
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  wizardDisplay: {
    backgroundColor: '#af8954',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  wizardList: {
    justifyContent: 'center',
  },
}));

const WizardList = observer(() => {
  const isMobile = useMediaQuery(viewerTheme.breakpoints.down('sm'));
  const store = useContext(StoreContext);
  const classes = useStyles(viewerTheme);
  const { ranks } = store;

  // pagination variables
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const start = page * pageSize;
  const end = (page + 1) * pageSize;

  useEffect(() => {
    setPage(0);
  }, [ranks.showUser]);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.flexContainer}>
        <List dense>
          {ranks.wizards.slice(start, end).map((wizard) => (
            <WizardListItem key={wizard.idx} wizard={wizard} />
          ))}
        </List>
        {!isMobile && <WizardDisplay />}
      </div>
      <div className={clsx(classes.itemContainer, classes.centerContainer)}>
        <TablePagination
          labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
          component="div"
          count={ranks.wizards.length}
          page={page}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[12, 25]}
          onChangePage={(_e, page) => setPage(page)}
          onChangeRowsPerPage={(e) => setPageSize(Number(e.target.value))}
        />
      </div>
    </div>
  );
});

export default WizardList;
