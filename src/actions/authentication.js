import * as api from "../api";
import { AUTHENTICATION } from "../constants/actionType";

export const signup = (formValues, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signup(formValues);
    dispatch({ type: AUTHENTICATION, payload: data });
    navigate("/")
  } catch (error) {
    console.log(error);
  }
};

export const signin = (formValues, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signin(formValues);
    dispatch({ type: AUTHENTICATION, payload: data });
    navigate("/")
  } catch (error) {
    console.log(error);
  }
};

