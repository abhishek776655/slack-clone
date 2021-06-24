import { Switch, BrowserRouter, Route } from "react-router-dom";
import CreateTeam from "./pages/CreateTeam";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewTeam from "./pages/ViewTeam";
import DirectMessages from "./pages/DirectMessages";
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <ProtectedRoute
          path="/view-team/user/:teamId/:userId"
          exact
          component={DirectMessages}
        />
        <ProtectedRoute
          path="/view-team/:teamId?/:channelId?"
          exact
          component={ViewTeam}
        />
        <ProtectedRoute path="/createTeam" exact component={CreateTeam} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
