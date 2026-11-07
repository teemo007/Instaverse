import { message } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { signOut } from "./authSlice";

export const useSignOut = (): (() => Promise<void>) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useCallback(async () => {
    const result = await dispatch(signOut());
    // A 401 means the server session was already gone and the client session
    // has been cleared, so the user is signed out either way.
    if (signOut.fulfilled.match(result) || result.payload?.status === 401) {
      navigate("/");
      return;
    }
    void message.error("Unable to log out. Please try again.");
  }, [dispatch, navigate]);
};
