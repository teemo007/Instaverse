import { AUTHENTICATION, SIGNOUT, AUTH_FAILED } from "../constants/actionType";

const authenticationReducer = (
  state = {
    authData: JSON.parse(localStorage.getItem("profile")) || null,
    error: null,
  },
  action
) => {
  switch (action.type) {
    case AUTHENTICATION:
      /* console.log(Object.values(action.payload?.result).map(({ password, ...rest }) => rest)) */
      delete action.payload.result.password;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      return {
        ...state,
        authData: action?.payload,
        error: null,
      };
    case AUTH_FAILED:
      return {
        ...state,
        error: action.payload,
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
