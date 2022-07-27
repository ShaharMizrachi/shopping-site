import { url } from "../../api/api";

export const fetchUserGet = (user, password) => async (dispatch, getState) => {
  try {
    const { data } = await url.post("/userGet", { user: `${user}`, password: `${password}` });
    console.log({ data });
    dispatch({ type: "FETCH_GET_USER", payload: data });
  } catch (e) {
    console.log({ e });
    dispatch({ type: "FETCH_GET_USER", payload: null });
  }
};
