import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="mb-10">
          <h1 className="text-6xl font-extrabold font-mono">Todo-List</h1>
        </div>
        <div className="flex w-[120%] text-lg text-gray-500">
          <div>
            <Dialog>
              <DialogTrigger>
                <p className="cursor-pointer transition-all ease-in-out duration-300 font-semibold hover:underline">
                  Login
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <div className="ml-auto">
            <Dialog>
              <DialogTrigger>
                <p className="ml-auto cursor-pointer font-semibold hover:underline">
                  Signup
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
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
