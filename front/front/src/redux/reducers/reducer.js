import { combineReducers } from "redux";
import getUserReducer from "./getUserReducer";

// combine reducers
const reducers = combineReducers({
  getUserReducer,
});

export default reducers;
