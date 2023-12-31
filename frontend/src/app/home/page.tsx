"use client";

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../Context/user";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.back();
    }
  }, [isLoggedIn, router]);

  return (
    <div>
      <Navbar />
      <div className="">page</div>
    </div>
  );
};

export default MainPage;
