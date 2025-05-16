"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
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
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Trash,
  UserPlus,
  Search,
  RefreshCw,
  ShieldAlert,
  Shield,
  UserCog,
  Key,
  UserX,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Sample data
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "global-admin" | "teacher" | "student";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  department?: string;
  yearLevel?: number;
  specialization?: string[];
};

const data: User[] = [
  {
    id: "728ed52f",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    role: "student",
    status: "active",
    createdAt: "2023-01-15",
    department: "BSIT",
    yearLevel: 2,
  },
  {
    id: "489e1d42",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    role: "student",
    status: "active",
    createdAt: "2023-01-20",
    department: "BSCS",
    yearLevel: 3,
  },
  {
    id: "a9f2e321",
    name: "Ana Reyes",
    email: "ana.reyes@example.com",
    role: "student",
    status: "inactive",
    createdAt: "2023-02-05",
    department: "BSN",
    yearLevel: 1,
  },
  {
    id: "fc7e0932",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    role: "teacher",
    status: "active",
    createdAt: "2022-11-10",
    specialization: ["Mathematics", "Computer Science"],
  },
  {
    id: "8d3b5a12",
    name: "Sofia Lim",
    email: "sofia.lim@example.com",
    role: "teacher",
    status: "active",
    createdAt: "2022-10-15",
    specialization: ["English", "Literature"],
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
    status: "suspended",
    createdAt: "2023-03-10",
    department: "BSIT",
    yearLevel: 4,
  },
  {
    id: "7d4c9b23",
    name: "System Administrator",
    email: "sysadmin@example.com",
    role: "global-admin",
    status: "active",
    createdAt: "2022-01-01",
  },
];

export const EnhancedUserManagement = forwardRef<
  { addUser: (user: any) => void } | null,
  {}
>((props, ref) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<
    "active" | "inactive" | "suspended"
  >("active");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User[]>(data);
  const [newUserHighlight, setNewUserHighlight] = useState<string | null>(null);

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  // Function to add a new user
  const addUser = (newUser: User) => {
    // Add the new user to the state
    setUserData((prevUsers) => [newUser, ...prevUsers]);

    // Set the highlight for the new user
    setNewUserHighlight(newUser.id);

    // Remove the highlight after 3 seconds
    setTimeout(() => {
      setNewUserHighlight(null);
    }, 3000);

    // Show a success toast
    toast({
      title: "User added successfully",
      description: `${newUser.name} has been added to the system.`,
    });
  };

  // Expose the addUser function to parent components
  useImperativeHandle(ref, () => ({
    addUser,
  }));

  // Listen for user registration events (this would be a WebSocket or similar in a real app)
  useEffect(() => {
    // This is a mock implementation for demonstration purposes
    // In a real app, you would connect to a WebSocket or use a similar real-time mechanism

    // Simulate receiving a new user registration after 5 seconds (for demo purposes)
    const mockUserRegistrationTimeout = setTimeout(() => {
      const mockNewUser: User = {
        id: `new-${Math.random().toString(36).substr(2, 9)}`,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "student",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        department: "BSCS",
        yearLevel: 1,
      };

      addUser(mockNewUser);
    }, 5000);

    return () => {
      clearTimeout(mockUserRegistrationTimeout);
    };
  }, []);

  // Filter data based on role, status, and search query
  const filteredData = userData.filter((user) => {
    // Filter by role
    if (filterRole !== "all" && user.role !== filterRole) {
      return false;
    }

    // Filter by status
    if (filterStatus !== "all" && user.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
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
        const role = row.getValue("role") as string;
        return (
          <div className="flex items-center">
            {role === "global-admin" ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                Global Admin
              </Badge>
            ) : role === "admin" ? (
              <Badge variant="default" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            ) : role === "teacher" ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <UserCog className="h-3 w-3" />
                Teacher
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <UserPlus className="h-3 w-3" />
                Student
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                status === "active"
                  ? "bg-green-500"
                  : status === "inactive"
                  ? "bg-gray-500"
                  : "bg-yellow-500"
              }`}
            />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        // Handle reset password
        const handleResetPassword = () => {
          setSelectedUserId(user.id);
          setIsResetPasswordOpen(true);
        };

        // Handle status change
        const handleStatusChange = (
          status: "active" | "inactive" | "suspended"
        ) => {
          setSelectedUserId(user.id);
          setNewStatus(status);
          setIsStatusChangeOpen(true);
        };

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCog className="mr-2 h-4 w-4" />
                View user details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCog className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetPassword}>
                <Key className="mr-2 h-4 w-4" />
                Reset password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.status === "active" ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("inactive")}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate user
                </DropdownMenuItem>
              )}
              {user.status !== "suspended" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("suspended")}
                >
                  <UserX className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Suspend user</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                disabled={
                  // Regular admins can't delete admin or global-admin users
                  (!isGlobalAdmin &&
                    (user.role === "admin" || user.role === "global-admin")) ||
                  // Global admins can't delete themselves
                  (isGlobalAdmin &&
                    user.role === "global-admin" &&
                    user.id === selectedUserId)
                }
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
  });

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete.",
        variant: "destructive",
      });
      return;
    }

    // Check if any admin is selected and the current user is not a global admin
    const hasAdmin = selectedRows.some(
      (row) =>
        row.original.role === "admin" || row.original.role === "global-admin"
    );

    // Check if any global admin is selected (even global admins can't delete other global admins)
    const hasGlobalAdmin = selectedRows.some(
      (row) => row.original.role === "global-admin"
    );

    // Regular admins can't delete admin or global-admin users
    if (!isGlobalAdmin && hasAdmin) {
      toast({
        title: "Cannot delete admin",
        description:
          "You don't have permission to delete administrator accounts.",
        variant: "destructive",
      });
      return;
    }

    // Even global admins can't delete global admin accounts
    if (isGlobalAdmin && hasGlobalAdmin) {
      toast({
        title: "Cannot delete global admin",
        description:
          "Global administrator accounts cannot be deleted through this interface for security reasons.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would delete the users here
    toast({
      title: "Users deleted",
      description: `${selectedRows.length} user(s) have been deleted.`,
    });

    // Clear selection
    table.resetRowSelection();
  };

  const handleResetPassword = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);

    try {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/users/${selectedUserId}/reset-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password reset successful",
        description:
          "A temporary password has been generated and sent to the user.",
      });

      setIsResetPasswordOpen(false);
    } catch (error) {
      toast({
        title: "Password reset failed",
        description:
          "There was an error resetting the password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);

    try {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/users/${selectedUserId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Status updated",
        description: `User status has been updated to ${newStatus}.`,
      });

      setIsStatusChangeOpen(false);
    } catch (error) {
      toast({
        title: "Status update failed",
        description:
          "There was an error updating the user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            {isGlobalAdmin
              ? "Global Admin access: Manage all users, roles, and permissions"
              : "Manage users, roles, and permissions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Filter users by role, status, or search by name/email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="role-filter" className="mb-2 block">
                Role
              </Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  {isGlobalAdmin && (
                    <SelectItem value="global-admin">Global Admins</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-filter" className="mb-2 block">
                Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search" className="mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row items-center py-4 gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} user(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-red-600"
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  selected user accounts and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSelected}
                  className="bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isNewUser = newUserHighlight === row.original.id;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      isNewUser
                        ? "animate-highlight bg-orange-50 dark:bg-orange-950/20"
                        : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will generate a new temporary password for the user. They
              will be required to change it on their next login.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to reset the password for this user?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusChangeOpen} onOpenChange={setIsStatusChangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Status</DialogTitle>
            <DialogDescription>
              {newStatus === "active"
                ? "This will activate the user account, allowing them to log in and use the system."
                : newStatus === "inactive"
                ? "This will deactivate the user account, preventing them from logging in."
                : "This will suspend the user account. This is typically used for disciplinary actions."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to change this user's status to{" "}
              <strong>{newStatus}</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusChangeOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={isLoading}
              variant={newStatus === "suspended" ? "destructive" : "default"}
            >
              {isLoading
                ? "Updating..."
                : `Change to ${
                    newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
                  }`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
