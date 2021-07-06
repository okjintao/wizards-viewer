import { Route, Switch } from 'react-router-dom';
import Affinities from '../pages/Affinities';
import WizardList from '../pages/WizardList';

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/">
        <WizardList />
      </Route>
      <Route path="/affinities">
        <Affinities />
      </Route>
    </Switch>
  );
}
