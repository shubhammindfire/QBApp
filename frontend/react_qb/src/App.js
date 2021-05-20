import Login from "./components/ui/screens/Login.js";
import Register from "./components/ui/screens/Register.js";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Portal from "./components/ui/screens/Portal.js";
import { setLocalAuthJwt } from "./redux/localAuth/localAuthActions.js";

function App() {
    const dispatch = useDispatch();
    const jwt = useSelector((state) => state.localAuth.jwt);

    // check if session variable has jwt or not
    let session_jwt = localStorage.getItem("session-jwt");
    session_jwt = (session_jwt !== null) ? JSON.parse(session_jwt) : null;
    if (session_jwt !== null && session_jwt.token !== null && session_jwt.token !== "") {
        dispatch(setLocalAuthJwt(session_jwt.token));
    }

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return jwt === null || jwt === "" ? (
                                <Redirect to="/login" />
                            ) : (
                                <Redirect to="/portal" />
                            );
                        }}
                    />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/portal" exact component={Portal} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
