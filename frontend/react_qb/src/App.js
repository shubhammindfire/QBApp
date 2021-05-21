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
import {
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    PORTAL_ROUTE,
    PORTAL_CUSTOMERS_ROUTE,
    PORTAL_ITEMS_ROUTE,
    PORTAL_INVOICES_ROUTE,
} from "./Constants.js";
import Customers from "./components/ui/screens/Customers.js";
import Invoices from "./components/ui/screens/Invoices.js";
import Items from "./components/ui/screens/Items.js";

function App() {
    const dispatch = useDispatch();
    const jwt = useSelector((state) => state.localAuth.jwt);

    // check if session variable has jwt or not
    let session_jwt = localStorage.getItem("session-jwt");
    session_jwt = session_jwt !== null ? JSON.parse(session_jwt) : null;
    if (
        session_jwt !== null &&
        session_jwt.token !== null &&
        session_jwt.token !== ""
    ) {
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
                                <Redirect to={LOGIN_ROUTE} />
                            ) : (
                                <Redirect to={PORTAL_ROUTE} />
                            );
                        }}
                    />
                    <Route path={LOGIN_ROUTE} exact component={Login} />
                    <Route path={REGISTER_ROUTE} exact component={Register} />
                    <Route path={PORTAL_ROUTE} exact component={Portal} />
                    <Route
                        path={PORTAL_CUSTOMERS_ROUTE}
                        exact
                        component={Customers}
                    />
                    <Route path={PORTAL_ITEMS_ROUTE} exact component={Items} />
                    <Route
                        path={PORTAL_INVOICES_ROUTE}
                        exact
                        component={Invoices}
                    />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
