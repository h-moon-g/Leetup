import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Groups from "./components/Groups";
import Events from "./components/Events";
import GetOneGroup from "./components/GetOneGroup";
import GetOneEvent from "./components/GetOneEvent";
import CreateGroup from "./components/CreateGroup";
import CreateEvent from "./components/CreateEvent";
import UpdateGroup from "./components/UpdateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroup />
          </Route>
          <Route exact path="/groups/:id/edit">
            <UpdateGroup />
          </Route>
          <Route exact path="/groups/:id/events/new">
            <CreateEvent />
          </Route>
          <Route exact path="/groups/:id">
            <GetOneGroup />
          </Route>
          <Route exact path="/events">
            <Events />
          </Route>
          <Route exact path="/events/:id">
            <GetOneEvent />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
