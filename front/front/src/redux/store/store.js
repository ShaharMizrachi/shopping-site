import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";

import reducers from "../reducers/reducer";
import { composeWithDevTools } from "redux-devtools-extension";

//middleware
const middleware = applyMiddleware(thunk);

//create store
const store = createStore(reducers, composeWithDevTools(middleware));

export default store;
