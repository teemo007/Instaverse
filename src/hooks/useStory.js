import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useStory = () => {
  const [expand, setExpand] = useState(true);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = useSelector((state) => state.authenticationReducer.authData);

  return {
    expand,
    setExpand,
    dispatch,
    navigate,
    user,
  };
};

export default useStory;
