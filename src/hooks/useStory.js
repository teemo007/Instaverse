import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useStory = () => {
  const [expand, setExpand] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showComment, setShowComment] = useState(false);
  const user = useSelector((state) => state.authenticationReducer.authData);

  useEffect(() => {
    if (!user) {
      setShowComment(false);
    }
  }, [user]);

  return {
    expand,
    setExpand,
    dispatch,
    navigate,
    showComment,
    setShowComment,
    user,
  };
};

export default useStory;
