import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import Axios from "axios";
import {
  DeleteUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  SignOutFailure,
  SignOutStart,
  SignOutSuccess,
  UpdateUserFailure,
  UpdateUserStart,
  UpdateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const [isShowListings, setIsShowListings] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storagetRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storagetRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(UpdateUserStart());
      const res = await Axios({
        url: `/api/user/update`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
      });
      if (res.data.success) {
        dispatch(UpdateUserSuccess(res.data.data));
        setUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(UpdateUserFailure(error.response.data.message));
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      dispatch(DeleteUserStart());
      const res = await Axios({
        url: `/api/user/delete`,
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        dispatch(DeleteUserSuccess());
      }
    } catch (error) {
      dispatch(DeleteUserFailure(error.response.data.message));
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignOutStart());
      const res = await Axios({
        url: `/api/auth/signout`,
        method: "get",
      });
      if (res.data.success) {
        dispatch(SignOutSuccess());
      }
    } catch (error) {
      dispatch(SignOutFailure(error.response.data.message));
    }
  };

  const handleGetListings = async () => {
    try {
      setShowListingsError(false);
      const res = await Axios(`/api/user/listings`);
      if (res.data.success) {
        setUserListings(res.data.data);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await Axios({
        url: `/api/listing/delete/${listingId}`,
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        handleGetListings();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetListings();
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {error ? (
        <p className="text-red-700 mt-5">{error}</p>
      ) : updateSuccess ? (
        <p className="text-green-700 mt-5">{"User is updated successfully!"}</p>
      ) : null}
      <button
        onClick={() => setIsShowListings(!isShowListings)}
        className="text-green-700 w-full"
      >
        {isShowListings ? "Hide" : "Show"} Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {isShowListings && userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
