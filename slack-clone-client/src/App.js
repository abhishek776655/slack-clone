import { Switch, BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
