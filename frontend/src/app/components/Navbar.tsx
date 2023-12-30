"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "../Context/user";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();

  return (
    <div className="px-10  w-full h-20 flex items-center absolute transition-all duration-500">
      <h1 className="text-2xl font-extrabold font-tektur text-green-700">
        Todo-List
      </h1>

      {isLoggedIn && (
        <div className="ml-auto">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="w-10 h-10"
            />
            <AvatarFallback>XN</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default Navbar;
