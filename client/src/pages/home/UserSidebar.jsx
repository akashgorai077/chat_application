// import React, { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import { FiLogOut, FiMessageCircle, FiUser } from "react-icons/fi";
// import User from "./User";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getOtherUsersThunk,
//   logoutUserThunk,
//   sendFriendRequestThunk,
//   cancelFriendRequestThunk,
//   acceptFriendRequestThunk,
//   denyFriendRequestThunk,
// } from "../../store/slice/user/userthunk";
// import { useNavigate } from "react-router-dom";
// import { setSelectedUser } from "../../store/slice/user/userslice";

// const UserSidebar = ({ isMobileOpen = true, onCloseMobile }) => {
//   const [searchValue, setsearchValue] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [users,setUsers] = useState([]);
//   const { otherUsers, userProfile, buttonLoading } = useSelector((state) => state.userReducer);

//   const friendRequestsReceivedSet = new Set(userProfile?.friendRequestsReceived || []);
//   const friendRequestsSentSet = new Set(userProfile?.friendRequestsSent || []);
//   const friendsSet = new Set(userProfile?.friends || []);

//   const handelLogout = async () => {
//     await dispatch(logoutUserThunk());
//   };
//   const handleGoHome = () => {
//     dispatch(setSelectedUser(null));
//     navigate("/home");
//     onCloseMobile?.();
//   };
//   useEffect(()=>{
//     if(!searchValue){
//       setUsers(otherUsers)
//     }else{
//       setUsers(
//         otherUsers.filter((user) => {
//           return (
//             user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
//             user.fullName
//               .toLowerCase()
//               .includes(searchValue.toLocaleLowerCase())
//           );
//         })
//       );
//     }
//   },[searchValue, otherUsers])

//   useEffect(() => {
//     (async () => {
//       await dispatch(getOtherUsersThunk());
//     })();
//   }, [dispatch]);

//   const getFriendStatus = (userId) => {
//     if (friendsSet.has(userId)) return "friends";
//     if (friendRequestsSentSet.has(userId)) return "requested";
//     if (friendRequestsReceivedSet.has(userId)) return "incoming";
//     return "none";
//   };

//   const handleSendRequest = async (userId) => {
//     await dispatch(sendFriendRequestThunk({ userId }));
//   };

//   const handleCancelRequest = async (userId) => {
//     await dispatch(cancelFriendRequestThunk({ userId }));
//   };

//   const handleAcceptRequest = async (userId) => {
//     await dispatch(acceptFriendRequestThunk({ userId }));
//   };

//   const handleDenyRequest = async (userId) => {
//     await dispatch(denyFriendRequestThunk({ userId }));
//   };

//   const incomingRequests = otherUsers?.filter(
//     (userDetails) => getFriendStatus(userDetails?._id) === "incoming"
//   );
//   const acceptedFriends = users?.filter(
//     (userDetails) => getFriendStatus(userDetails?._id) === "friends"
//   );
//   const otherUsersSection = users?.filter((userDetails) => {
//     const friendStatus = getFriendStatus(userDetails?._id);
//     return friendStatus !== "friends" && friendStatus !== "incoming";
//   });

//   const renderUserRow = (userDetails) => {
//     const friendStatus = getFriendStatus(userDetails?._id);
//     const actionButtonLabel =
//       friendStatus === "friends"
//         ? null
//         : friendStatus === "requested"
//         ? "Requested"
//         : "Add";

//     return (
//       <User
//         key={userDetails._id}
//         userDetails={userDetails}
//         actionButtonLabel={actionButtonLabel}
//         disabledActionButton={buttonLoading}
//         onUserClick={() => onCloseMobile?.()}
//         onActionClick={() => {
//           if (friendStatus === "requested") {
//             handleCancelRequest(userDetails?._id);
//             return;
//           }
//           if (friendStatus === "none") {
//             handleSendRequest(userDetails?._id);
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <aside
//       className={`fixed inset-y-0 left-0 z-40 w-[18rem] md:w-[20rem] lg:w-[22rem] h-[100dvh] flex flex-col glass-card border-r border-base-300/80 transform transition-transform duration-300 md:translate-x-0 md:static ${
//         isMobileOpen ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       <button
//         className="mx-3 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-lg font-semibold text-primary hover:bg-base-200/80 focus-ring"
//         onClick={handleGoHome}
//       >
//         <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-content">
//           <FiMessageCircle />
//         </span>
//         WeChat
//       </button>
//       <div className="p-3">
//         <label className="w-full flex items-center gap-2 input bg-base-100/80 backdrop-blur-lg border border-base-300 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
//           <input
//             onChange={(e) => setsearchValue(e.target.value)}
//             type="text"
//             className="grow bg-transparent outline-none"
//             placeholder="Search"
//           />
//           <FaSearch />
//         </label>
//       </div>

//       <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 flex flex-col gap-3">
//         {incomingRequests?.length > 0 ? (
//           <div className="glass-card rounded-lg shadow-soft border border-base-300 p-3">
//             <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-2 px-1">
//               Friend Requests
//             </h3>
//             <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
//               {incomingRequests.map((userDetails) => (
//                 <div
//                   key={`incoming-${userDetails._id}`}
//                   className="flex items-center gap-2 p-2 rounded-lg bg-base-100/70 border border-base-300"
//                 >
//                   <div className="avatar">
//                     <div className="w-8 rounded-full">
//                       <img src={userDetails?.avatar} alt={userDetails?.username} />
//                     </div>
//                   </div>
//                   <div className="flex-1 overflow-hidden">
//                     <p className="text-sm truncate">{userDetails?.fullName}</p>
//                     <p className="text-xs text-base-content/60 truncate">@{userDetails?.username}</p>
//                   </div>
//                   <button
//                     className="btn btn-success btn-xs"
//                     disabled={buttonLoading}
//                     onClick={() => handleAcceptRequest(userDetails?._id)}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="btn btn-error btn-xs"
//                     disabled={buttonLoading}
//                     onClick={() => handleDenyRequest(userDetails?._id)}
//                   >
//                     Deny
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : null}

//         <div className="text-xs font-semibold uppercase tracking-wide text-base-content/50 px-1">Friends</div>
//         {acceptedFriends?.length > 0 ? (
//           acceptedFriends.map((userDetails) => renderUserRow(userDetails))
//         ) : (
//           <p className="text-xs text-base-content/50 px-1 pb-1">No accepted friends yet</p>
//         )}

//         <div className="text-xs font-semibold uppercase tracking-wide text-base-content/50 px-1 mt-2">
//           Other Users
//         </div>
//         {otherUsersSection?.length > 0 ? (
//           otherUsersSection.map((userDetails) => renderUserRow(userDetails))
//         ) : (
//           <p className="text-xs text-base-content/50 px-1 pb-1">No other users</p>
//         )}
//       </div>

//       <div className="flex items-center justify-between gap-3 p-3 border-t border-base-300 bg-base-100/70 backdrop-blur-xl">
//         <button
//           className="min-w-0 flex items-center gap-3 rounded-lg p-1 text-left hover:bg-base-200/80 focus-ring"
//           onClick={() => {
//             navigate("/home/me");
//             onCloseMobile?.();
//           }}
//         >
//           <div className="avatar">
//             <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
//               <img src={userProfile?.avatar} />
//             </div>
//           </div>
//           <div className="min-w-0">
//             <h2 className="truncate text-sm font-semibold">{userProfile?.username}</h2>
//             <p className="flex items-center gap-1 text-xs text-base-content/50">
//               <FiUser className="shrink-0" /> Profile
//             </p>
//           </div>
//         </button>

//         <button
//           onClick={handelLogout}
//           className="btn btn-ghost btn-sm rounded-lg text-base-content/70 hover:text-error"
//           aria-label="Logout"
//         >
//           <FiLogOut />
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default UserSidebar;


import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
  sendFriendRequestThunk,
  cancelFriendRequestThunk,
  acceptFriendRequestThunk,
  denyFriendRequestThunk,
} from "../../store/slice/user/userthunk";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../../store/slice/user/userslice";
import chatLogo from "../../assets/chat.png";

const UserSidebar = ({ isMobileOpen = true, onCloseMobile }) => {
  const [searchValue, setsearchValue] = useState("");
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otherUsers, userProfile, buttonLoading } = useSelector(
    (state) => state.userReducer
  );

  const friendRequestsReceivedSet = new Set(
    userProfile?.friendRequestsReceived || []
  );

  const friendRequestsSentSet = new Set(
    userProfile?.friendRequestsSent || []
  );

  const friendsSet = new Set(userProfile?.friends || []);

  const handelLogout = async () => {
    await dispatch(logoutUserThunk());
  };

  const handleGoHome = () => {
    dispatch(setSelectedUser(null));
    navigate("/home");
    onCloseMobile?.();
  };

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers);
    } else {
      setUsers(
        otherUsers.filter((user) => {
          return (
            user.username
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            user.fullName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        })
      );
    }
  }, [searchValue, otherUsers]);

  useEffect(() => {
    (async () => {
      await dispatch(getOtherUsersThunk());
    })();
  }, [dispatch]);

  const getFriendStatus = (userId) => {
    if (friendsSet.has(userId)) return "friends";
    if (friendRequestsSentSet.has(userId)) return "requested";
    if (friendRequestsReceivedSet.has(userId)) return "incoming";
    return "none";
  };

  const handleSendRequest = async (userId) => {
    await dispatch(sendFriendRequestThunk({ userId }));
  };

  const handleCancelRequest = async (userId) => {
    await dispatch(cancelFriendRequestThunk({ userId }));
  };

  const handleAcceptRequest = async (userId) => {
    await dispatch(acceptFriendRequestThunk({ userId }));
  };

  const handleDenyRequest = async (userId) => {
    await dispatch(denyFriendRequestThunk({ userId }));
  };

  const incomingRequests = otherUsers?.filter(
    (userDetails) => getFriendStatus(userDetails?._id) === "incoming"
  );

  const acceptedFriends = users?.filter(
    (userDetails) => getFriendStatus(userDetails?._id) === "friends"
  );

  const otherUsersSection = users?.filter((userDetails) => {
    const friendStatus = getFriendStatus(userDetails?._id);

    return (
      friendStatus !== "friends" && friendStatus !== "incoming"
    );
  });

  const renderUserRow = (userDetails) => {
    const friendStatus = getFriendStatus(userDetails?._id);

    const actionButtonLabel =
      friendStatus === "friends"
        ? null
        : friendStatus === "requested"
        ? "Requested"
        : "Add";

    return (
      <User
        key={userDetails._id}
        userDetails={userDetails}
        actionButtonLabel={actionButtonLabel}
        disabledActionButton={buttonLoading}
        onUserClick={() => onCloseMobile?.()}
        onActionClick={() => {
          if (friendStatus === "requested") {
            handleCancelRequest(userDetails?._id);
            return;
          }

          if (friendStatus === "none") {
            handleSendRequest(userDetails?._id);
          }
        }}
      />
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-[100dvh] w-[min(22rem,calc(100vw-1rem))] flex-col glass-card border-r border-base-300/80 transform transition-transform duration-300 md:static md:w-[20rem] md:translate-x-0 lg:w-[22rem] ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <button
        className="mx-3 mt-3 flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-lg font-semibold text-primary hover:bg-base-200/80 focus-ring"
        onClick={handleGoHome}
      >
       <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning/10 overflow-hidden">
  <img
    src={chatLogo}
    alt="WeChat Logo"
    className="h-7 w-7 object-contain"
  />
</span>

        <span className="truncate">WeChat</span>
      </button> */}
      
    {/* <button
  className="mx-3 mt-3 flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-lg font-semibold text-primary hover:bg-base-200/80 transition-all duration-300 focus-ring "
  onClick={handleGoHome}
>
  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-warning/20 border border-primary/20 shadow-lg overflow-hidden">
    <img
      src={chatLogo}
      alt="WeChat Logo"
      className="h-8 w-8 object-contain drop-shadow-md"
    />
  </span>

<span className="truncate text-2xl font-bold tracking-wide text-primary ">
  WeChat
</span>
</button> */}
<button
  className="mx-3 mt-3 flex min-w-0 items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:bg-base-200/40 focus-ring"
  onClick={handleGoHome}
>
  {/* Logo Container */}
  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-base-300/40 bg-base-100/70 shadow-lg backdrop-blur-xl overflow-hidden transition-all duration-300 hover:scale-105">
    <img
      src={chatLogo}
      alt="WeChat Logo"
      className="h-9 w-9 object-contain drop-shadow-md"
    />
  </span>

  {/* Logo Text */}
  <div className="flex flex-col leading-none">
    <span className="truncate text-2xl font-bold tracking-wide text-primary">
      WeChat
    </span>
  </div>
</button>
{/* Search Bar */}
      <div className="p-3">
        <label className="w-full flex items-center gap-2 input bg-base-100/80 backdrop-blur-lg border border-base-300 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          <input
            onChange={(e) => setsearchValue(e.target.value)}
            type="text"
            className="grow bg-transparent outline-none"
            placeholder="Search"
          />

          <FaSearch className="text-warning" />
        </label>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 flex flex-col gap-3">
        {incomingRequests?.length > 0 ? (
          <div className="glass-card rounded-lg shadow-soft border border-base-300 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-warning mb-2 px-1">
              Friend Requests
            </h3>

            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
              {incomingRequests.map((userDetails) => (
                <div
                  key={`incoming-${userDetails._id}`}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-base-300 bg-base-100/70 p-2 sm:flex-nowrap"
                >
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={userDetails?.avatar}
                        alt={userDetails?.username}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm truncate">
                      {userDetails?.fullName}
                    </p>

                    <p className="text-xs text-base-content/60 truncate">
                      @{userDetails?.username}
                    </p>
                  </div>

                  <button
                    className="btn btn-success btn-xs ml-auto rounded-lg"
                    disabled={buttonLoading}
                    onClick={() =>
                      handleAcceptRequest(userDetails?._id)
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-error btn-xs rounded-lg"
                    disabled={buttonLoading}
                    onClick={() =>
                      handleDenyRequest(userDetails?._id)
                    }
                  >
                    Deny
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="text-xs font-semibold uppercase tracking-wide text-base-content/50 px-1">
          Friends
        </div>

        {acceptedFriends?.length > 0 ? (
          acceptedFriends.map((userDetails) =>
            renderUserRow(userDetails)
          )
        ) : (
          <p className="text-xs text-base-content/50 px-1 pb-1">
            No accepted friends yet
          </p>
        )}

        <div className="text-xs font-semibold uppercase tracking-wide text-base-content/50 px-1 mt-2">
          Other Users
        </div>

        {otherUsersSection?.length > 0 ? (
          otherUsersSection.map((userDetails) =>
            renderUserRow(userDetails)
          )
        ) : (
          <p className="text-xs text-base-content/50 px-1 pb-1">
            No other users
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 p-3 border-t border-base-300 bg-base-100/70 backdrop-blur-xl">
        <button
          className="min-w-0 flex flex-1 items-center gap-3 rounded-lg p-1 text-left hover:bg-base-200/80 focus-ring"
          onClick={() => {
            navigate("/home/me");
            onCloseMobile?.();
          }}
        >
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
              <img src={userProfile?.avatar} alt="Profile" />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">
              {userProfile?.username}
            </h2>

            <p className="flex items-center gap-1 text-xs text-base-content/50">
              <FiUser className="shrink-0" />
              Profile
            </p>
          </div>
        </button>

        <button
          onClick={handelLogout}
          className="btn btn-ghost btn-sm rounded-lg text-base-content/70 hover:text-error"
          aria-label="Logout"
        >
          <FiLogOut className="text-xl"  />
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
