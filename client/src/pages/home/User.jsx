import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../store/slice/user/userslice';

const User = ({
  userDetails,
  actionButtonLabel,
  onActionClick,
  disabledActionButton,
  onUserClick,
}) => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);

  const isUserOnline = onlineUsers?.includes(userDetails?._id);

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
    onUserClick?.(userDetails);
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex min-w-0 items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all duration-200
        hover:bg-base-200/80 hover:border-base-300
        ${
          userDetails?._id === selectedUser?._id
            ? "bg-primary/10 border-primary/30 shadow-sm"
            : "border-transparent"
        }
      `}
    >
      {/* Avatar with online indicator */}
      <div
  className={`avatar relative ${
    isUserOnline ? 'avatar-online' : ''
  }`}
>
  <div className="w-11 rounded-full ring-2 ring-primary/70">
    <img
      src={userDetails?.avatar}
      alt="user avatar"
      className="object-cover"
    />
  </div>
</div>
      {/* User Info */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <h2 className="text-sm font-semibold text-base-content truncate">{userDetails?.fullName}</h2>
        <p className="text-xs text-base-content/55 truncate">@{userDetails?.username}</p>
      </div>

      {actionButtonLabel ? (
        <button
          className=" ml-auto shrink-0
  rounded-xl
  bg-gradient-to-br
  from-cyan-500
  via-blue-500
  to-violet-600
  px-4 py-1.5
  text-[11px] font-medium
  text-white
  shadow-lg
  transition-all duration-300
  hover:-translate-y-0.5
  hover:shadow-violet-500/25
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.(userDetails);
          }}
          disabled={disabledActionButton}
        >
          {actionButtonLabel}
        </button>
      ) : null}
    </div>
  );
};

export default User;
