import { ISLOGIN } from "../constants/actionType";

const storyformReduecer = (state = { islogin: false }, action) => {
  switch (action.type) {
    case ISLOGIN:
      return {
        ...state,
        islogin: action.payload,
      };

    default:
      return state;
  }
};

export default storyformReduecer;
