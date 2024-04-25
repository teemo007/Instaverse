import { AUTHENTICATION, SIGNOUT } from "../constants/actionType";

const authenticationReducer = (
  state = { authData: JSON.parse(localStorage.getItem("profile")) || null },
  action
) => {
  switch (action.type) {
    case AUTHENTICATION:
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      return {
        ...state,
        authData: action?.payload,
      };
    case SIGNOUT:
      localStorage.clear();
      return {
        ...state,
        authData: null,
      };

    default:
      return state;
  }
};

export default authenticationReducer;
