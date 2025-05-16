"use client"

import type React from "react"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Trash, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Sample data
type User = {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
  status: "active" | "inactive" | "pending"
  createdAt: string
}

const data: User[] = [
  {
    id: "728ed52f",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    role: "student",
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "489e1d42",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    role: "student",
    status: "active",
    createdAt: "2023-01-20",
  },
  {
    id: "a9f2e321",
    name: "Ana Reyes",
    email: "ana.reyes@example.com",
    role: "student",
    status: "inactive",
    createdAt: "2023-02-05",
  },
  {
    id: "fc7e0932",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    role: "teacher",
    status: "active",
    createdAt: "2022-11-10",
  },
  {
    id: "8d3b5a12",
    name: "Sofia Lim",
    email: "sofia.lim@example.com",
    role: "teacher",
    status: "active",
    createdAt: "2022-10-15",
  },
  {
    id: "6e9c4b78",
    name: "Miguel Garcia",
    email: "miguel.garcia@example.com",
    role: "admin",
    status: "active",
    createdAt: "2022-09-01",
  },
  {
    id: "2f5a8e19",
    name: "Isabella Tan",
    email: "isabella.tan@example.com",
    role: "student",
    status: "pending",
    createdAt: "2023-03-10",
  },
]

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={role === "admin" ? "default" : role === "teacher" ? "secondary" : "outline"}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center">
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              status === "active" ? "bg-green-500" : status === "inactive" ? "bg-gray-500" : "bg-yellow-500"
            }`}
          />
          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user details</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" disabled={user.role === "admin"}>
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UserManagement() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isImportUsersOpen, setIsImportUsersOpen] = useState(false)
  const [filterRole, setFilterRole] = useState<string>("all")

  const filteredData = filterRole === "all" ? data : data.filter((user) => user.role === filterRole)

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddUserOpen(false)
    toast({
      title: "User added",
      description: "The new user has been added successfully.",
    })
  }

  const handleImportUsers = (e: React.FormEvent) => {
    e.preventDefault()
    setIsImportUsersOpen(false)
    toast({
      title: "Users imported",
      description: "The users have been imported successfully.",
    })
  }

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete.",
        variant: "destructive",
      })
      return
    }

    // Check if any admin is selected
    const hasAdmin = selectedRows.some((row) => row.original.role === "admin")
    if (hasAdmin) {
      toast({
        title: "Cannot delete admin",
        description: "Admin users cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would delete the users here
    toast({
      title: "Users deleted",
      description: `${selectedRows.length} user(s) have been deleted.`,
    })

    // Clear selection
    table.resetRowSelection()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Fill in the details to create a new user account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="Full name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" placeholder="Email address" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select defaultValue="student">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportUsersOpen} onOpenChange={setIsImportUsersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Import Users
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Users</DialogTitle>
                <DialogDescription>Upload a CSV file to import multiple users at once.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleImportUsers}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 items-center gap-4">
                    <Label htmlFor="file">CSV File</Label>
                    <Input id="file" type="file" accept=".csv" required />
                    <p className="text-sm text-muted-foreground">
                      The CSV file should have the following columns: name, email, role, status
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Import</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setFilterRole}>
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="teacher">Teachers</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row items-center py-4 gap-4">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} user(s)
          selected.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-red-600"
            onClick={handleDeleteSelected}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
