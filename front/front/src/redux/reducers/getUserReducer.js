const getUserReducer = (state = null, action) => {
  //check the action type
  if (action.type === "FETCH_GET_USER" && action.payload !== null) {
    console.log(action.payload);
    return action.payload;
  }

  return state;
};

export default getUserReducer;
