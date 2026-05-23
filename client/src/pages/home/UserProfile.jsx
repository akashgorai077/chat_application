import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { setSelectedUser } from "../../store/slice/user/userslice";
import { unfriendUserThunk } from "../../store/slice/user/userthunk";
import { getMessageThunk } from "../../store/slice/message/messageThunk";
import { FiMenu } from "react-icons/fi";

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, otherUsers, userProfile, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const [connectedDate, setConnectedDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const profileUser = useMemo(() => {
    if (selectedUser?._id === userId) return selectedUser;
    return otherUsers?.find((user) => String(user?._id) === String(userId)) || null;
  }, [selectedUser, otherUsers, userId]);

  useEffect(() => {
    if (profileUser && selectedUser?._id !== profileUser?._id) {
      dispatch(setSelectedUser(profileUser));
    }
  }, [profileUser, selectedUser, dispatch]);

  const isFriend = userProfile?.friends?.some(
    (friendId) => String(friendId) === String(profileUser?._id)
  );

  const handleUnfriend = async () => {
    if (!profileUser?._id) return;
    await dispatch(unfriendUserThunk({ userId: profileUser._id }));
    navigate("/home");
  };

  useEffect(() => {
    const fetchConnectionDate = async () => {
      if (!profileUser?._id || !isFriend) {
        setConnectedDate(null);
        return;
      }
      try {
        const response = await dispatch(
          getMessageThunk({ receiverId: profileUser._id })
        ).unwrap();
        setConnectedDate(response?.responseData?.createdAt || null);
      } catch {
        setConnectedDate(null);
      }
    };

    fetchConnectionDate();
  }, [dispatch, profileUser, isFriend]);

  return (
    <div className="h-[100dvh] overflow-hidden app-surface text-base-content md:flex">
      {isSidebarOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <UserSidebar
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="h-full min-h-0 w-full overflow-y-auto p-3 sm:p-4 md:p-10">
        <button
          className="btn btn-ghost btn-sm mb-4 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="text-lg" />
        </button>
        {!profileUser ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-xl font-semibold">User not found</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/home")}>
              Back to chat
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-xl glass-card rounded-lg p-5 shadow-soft sm:p-6 md:p-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="avatar">
                <div className="w-24 rounded-full ring-2 ring-blue-500 sm:w-28">
                  <img src={profileUser?.avatar} alt={profileUser?.username} />
                </div>
              </div>

              <h1 className="break-words text-xl font-semibold sm:text-2xl">{profileUser?.fullName}</h1>
              <p className="text-sm text-base-content/60">@{profileUser?.username}</p>
            </div>

            <div className="mt-7 space-y-3 text-sm">
              <p>
                <span className="text-base-content/50">Username:</span> @{profileUser?.username}
              </p>
              <p>
                <span className="text-base-content/50">Gender:</span>{" "}
                {profileUser?.gender || "Not available"}
              </p>
              <p>
                <span className="text-base-content/50">Joined:</span>{" "}
                {formatDate(profileUser?.createdAt)}
              </p>
              <p>
                <span className="text-base-content/50">Connected date:</span>{" "}
                {isFriend ? formatDate(connectedDate) : "Not connected"}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-outline btn-sm rounded-lg" onClick={() => navigate("/home")}>
                Back to chat
              </button>
              {isFriend ? (
                <button
                  className="btn btn-error btn-sm rounded-lg"
                  onClick={handleUnfriend}
                  disabled={buttonLoading}
                >
                  Unfriend
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
