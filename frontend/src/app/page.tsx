"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  return (
    <div className="h-screen w-screen flex justify-center items-center">
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
                    />
                    <Input
                      className="mt-4"
                      placeholder="Password"
                      type="password"
                    />
                    <Button className="mt-4 w-full">Login</Button>
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
                      type="email"
                    />
                    <Input
                      className="mt-4"
                      placeholder="Password"
                      type="password"
                    />
                    <Button
                      className="mt-4 w-full"
                      onClick={() => {
                        toast({
                          title: "Scheduled: Catch up",
                          description: "Friday, February 10, 2023 at 5:57 PM",
                        });
                      }}
                    >
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
  );
}
