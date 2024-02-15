import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import Axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await Axios({
        url: `/api/auth/google`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: result.user.email,
          avatar: result.user.photoURL,
        },
      });

      if (res.data.success) {
        dispatch(signInSuccess(res.data.data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log("count not sign in with google", error);
    }
  };
  return (
    <button
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
