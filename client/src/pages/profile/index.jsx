import { useAppStore } from "@/store";
import React from "react";

function Profile() {
  const { userInfo } = useAppStore();
  console.log(userInfo);
  return (
    <div>
      <h1>Profile</h1>
      <div>
        Email: {userInfo.email}
      </div>
    </div>
  );
}

export default Profile;
