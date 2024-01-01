"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Task = {
  ID: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  user_id?: number;
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "ID",
    header: "task",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      return new Date(row.getValue("due_date")).toLocaleDateString();
    },
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) => {
      return row.original.completed ? "Yes" : "No";
    },
  },
];
