"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../Context/user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateIcon } from "@radix-ui/react-icons";

const MainPage = () => {
  const { isLoggedIn, user } = useAuthContext();
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.back();
    }
  }, [isLoggedIn, router]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <div className="px-16 mt-10 flex flex-col h-full mb-10">
        <div className="lg:mt-5 h-fit">
          <p className="text-2xl font-mono lg:text-3xl">
            🖐 Welcome {user.toLocaleUpperCase()} 😎
          </p>
        </div>

        <div className="flex-grow flex-shrink mt-10 lg:mt-16">
          <div className="border-r-2 w-44 h-full lg:w-60 text-center pt-10 lg:pt-5">
            <Dialog>
              <DialogTrigger>
                <Button>Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                  <DialogDescription>
                    Add new task to your list
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Task Name"
                    className="w-full mt-2"
                    type="text"
                  />
                  <Input
                    placeholder="Task Description"
                    className="w-full"
                    type="text"
                  />
                </div>
                <Popover>
                  <PopoverTrigger>
                    <Button className="mt-4 w-full">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {date ? date.toLocaleDateString() : "Select Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
                <DialogClose>
                  <div className="w-full flex">
                    <Button className="w-40 ml-auto">
                      {!isLoading && (
                        <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                      )}
                      Done
                    </Button>
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
