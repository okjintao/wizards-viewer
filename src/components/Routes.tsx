import { Route, Switch } from 'react-router-dom';
import Affinities from '../pages/Affinities';
import Traits from '../pages/Traits';
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
      <Route path="/traits">
        <Traits />
      </Route>
    </Switch>
  );
}
