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

import React, { useEffect, useState, useRef } from "react";

import Navbar from "../components/Navbar";
import { useAuthContext } from "../Context/user";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateIcon } from "@radix-ui/react-icons";

import { columns, Task } from "../components/tasks/columns";
import { DataTable } from "../components/tasks/data-table";
import { get } from "http";

const MainPage = () => {
  const { isLoggedIn, user, userId } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<[]>([]);
  const taskNumberRef = useRef<HTMLInputElement>(null);
  const tComRef = useRef<HTMLInputElement>(null);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskDescriptionRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const router = useRouter();

  const createTask = async () => {
    try {
      setIsLoading(true);
      const taskName = taskNameRef.current?.value;
      const taskDescription = taskDescriptionRef.current?.value;
      const time = date?.toISOString();

      if (taskName && taskDescription && time) {
        const response = await fetch("http://localhost:5000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: String(taskName),
            description: String(taskDescription),
            due_date: time,
            user_id: userId,
          }),
        });

        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Task created successfully",
            variant: "default",
          });
          router.refresh();
          getTask();
        } else {
          toast({
            title: "Error",
            description: "Failed to create task",
            variant: "destructive",
          });
        }

        const responseData = response.json();
      } else {
        toast({
          title: "Error",
          description: "All fields are required",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setTasks(responseData.tasks);
    } catch (err) {
      console.log(err);
    }
  };

  const removeTask = async () => {
    try {
      setIsLoading(true);
      const taskId = taskNumberRef.current?.value;
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Task deleted successfully",
          variant: "default",
        });
        getTask();
        router.refresh();
      }

      // const responseData = await response.json();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markTask = async () => {
    try {
      setIsLoading(true);
      const taskId = tComRef.current?.value;
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Task updated Successfully",
          variant: "default",
        });
        getTask();
        router.refresh();
      }

      // const responseData = await response.json();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.back();
    } else {
      getTask();
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

        <div className="flex-grow flex mt-10 lg:mt-16">
          <div className="border-r-2 w-44 h-full lg:w-60 text-center pt-10 lg:pt-5">
            <div>
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
                      ref={taskNameRef}
                    />
                    <Input
                      placeholder="Task Description"
                      className="w-full"
                      type="text"
                      ref={taskDescriptionRef}
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
                      <Button className="w-40 ml-auto" onClick={createTask}>
                        {isLoading && (
                          <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        Done
                      </Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-5">
              <Dialog>
                <DialogTrigger>
                  <Button variant={"destructive"}>Rem Task</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Task</DialogTitle>
                    <DialogDescription>Remove task from list</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Task Number"
                      className="w-"
                      type="number"
                      ref={taskNumberRef}
                    />
                  </div>

                  <DialogClose>
                    <div className="">
                      <Button
                        variant={"destructive"}
                        className="w-40 ml-auto"
                        onClick={removeTask}
                      >
                        {isLoading && (
                          <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        Done
                      </Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-5">
              <Dialog>
                <DialogTrigger>
                  <Button className=" bg-green-500 hover:bg-green-700">
                    Mark Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mark Task</DialogTitle>
                    <DialogDescription>Mark task as complete</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Task Number"
                      className="w-"
                      type="number"
                      ref={tComRef}
                    />
                  </div>

                  <DialogClose>
                    <div className="">
                      <Button className="w-40 ml-auto" onClick={markTask}>
                        {isLoading && (
                          <UpdateIcon className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        Mark
                      </Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex-grow ml-10">
            <div className="mb-4">
              <p className="text-xl">Your tasks</p>
            </div>
            <div>
              <DataTable columns={columns} data={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
