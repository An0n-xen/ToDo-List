"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UpdateIcon } from "@radix-ui/react-icons";
import Navbar from "./components/Navbar";
import { useAuthContext } from "./Context/user";

export default function Home() {
  const { toast } = useToast();
  const [isloading, setIsloading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuthContext();
  const router = useRouter();

  const handleLogIn = async () => {
    try {
      setIsloading(true);
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      if (response.status === 404) {
        toast({
          title: "Invalid User",
          description: "User not found",
          variant: "destructive",
        });
      } else if (response.status === 401) {
        toast({
          title: "Invalid User",
          description: "User not found",
          variant: "destructive",
        });
      } else if (response.status === 200) {
        const username = usernameRef.current?.value || "";
        setUser(username);
        setIsLoggedIn(true);
        toast({
          title: "Success",
          description: "Login Successful",
          variant: "default",
        });
        router.push("/home");
      } else {
        toast({
          title: "Error",
          description: "Login Failed",
          variant: "destructive",
        });
      }

      const responseData = await response.json();
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: "Login Failed",
        variant: "destructive",
      });
    } finally {
      setIsloading(false);
    }
  };
  const handleSingUp = async () => {
    try {
      setIsloading(true);
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: usernameRef.current?.value,
          Password: passwordRef.current?.value,
        }),
      });

      if (response.status === 409) {
        toast({
          title: "Error",
          description: "User already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Account Created",
          variant: "default",
        });
        router.push("/home");
      }

      const responseData = await response.json();
    } catch (err) {
      console.log(err);

      toast({
        title: "Error",
        description: "Sign Up Failed",
        variant: "destructive",
      });
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex flex-grow justify-center items-center -mt-10">
        <div className="flex flex-col items-center">
          <div className="mb-10">
            <h1 className="text-6xl font-extrabold font-tektur">Todo-List</h1>
          </div>
          <div className="flex w-[110%] text-lg text-gray-500">
            <div>
              <Dialog>
                <DialogTrigger>
                  <p className="cursor-pointer transition-all ease-in-out duration-300 font-semibold hover:underline">
                    Login
                  </p>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <p className="font-extrabold">LOGIN</p>
                    </DialogTitle>
                    <DialogDescription>
                      <Input
                        className="mt-4 "
                        placeholder="Username"
                        type="email"
                        ref={usernameRef}
                      />
                      <Input
                        className="mt-4"
                        placeholder="Password"
                        type="password"
                        ref={passwordRef}
                      />
                      <Button className="mt-4 w-full" onClick={handleLogIn}>
                        {isloading && (
                          <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        Login
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="ml-auto">
              <Dialog>
                <DialogTrigger>
                  <p className="cursor-pointer transition-all ease-in-out duration-300 font-semibold hover:underline">
                    Singup
                  </p>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <p className="font-extrabold">SIGNUP</p>
                    </DialogTitle>
                    <DialogDescription>
                      <Input
                        className="mt-4 "
                        placeholder="Username"
                        type="text"
                        ref={usernameRef}
                      />
                      <Input
                        className="mt-4"
                        placeholder="Password"
                        type="password"
                        ref={passwordRef}
                      />
                      <Button className="mt-4 w-full" onClick={handleSingUp}>
                        {isloading && (
                          <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        Sign up
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
