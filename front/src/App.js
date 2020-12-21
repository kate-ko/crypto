import './App.css';
import './style.css'
import 'bootstrap/dist/css/bootstrap.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Navbar from './Navbar'
import Rates from './Rates'
import History from './History'

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route path="/Rates">
          <Rates />
        </Route>

        <Route path="/history">
          <History />
        </Route>

        <Route exact path="/">
          <Redirect to="/Rates" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
