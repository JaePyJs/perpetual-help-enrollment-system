"use client";

import { useState } from "react";
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
  Search,
  RefreshCw,
  Shield,
  FileText,
  Calendar,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Sample data
type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: any;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
};

const data: AuditLog[] = [
  {
    id: "1",
    userId: "admin1",
    userName: "System Administrator",
    userRole: "global-admin",
    action: "user_create",
    details: {
      email: "student1@example.com",
      role: "student",
      department: "BSIT",
      yearLevel: 2,
    },
    targetId: "student1",
    targetName: "John Doe",
    targetRole: "student",
    timestamp: "2023-05-15T10:30:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "2",
    userId: "admin1",
    userName: "System Administrator",
    userRole: "global-admin",
    action: "user_update",
    details: {
      updates: {
        name: "Jane Smith Updated",
      },
      previousData: {
        name: "Jane Smith",
      },
    },
    targetId: "student2",
    targetName: "Jane Smith",
    targetRole: "student",
    timestamp: "2023-05-16T14:20:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "3",
    userId: "admin2",
    userName: "Department Admin",
    userRole: "admin",
    action: "user_password_reset",
    details: {
      userId: "teacher1",
    },
    targetId: "teacher1",
    targetName: "Professor Johnson",
    targetRole: "teacher",
    timestamp: "2023-05-17T09:15:00Z",
    ipAddress: "192.168.1.2",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
  {
    id: "4",
    userId: "admin1",
    userName: "System Administrator",
    userRole: "global-admin",
    action: "user_deactivate",
    details: {
      userId: "student3",
      previousStatus: "active",
      newStatus: "inactive",
    },
    targetId: "student3",
    targetName: "Robert Brown",
    targetRole: "student",
    timestamp: "2023-05-18T16:45:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "5",
    userId: "admin2",
    userName: "Department Admin",
    userRole: "admin",
    action: "login_success",
    details: {
      loginTime: "2023-05-19T08:30:00Z",
    },
    timestamp: "2023-05-19T08:30:00Z",
    ipAddress: "192.168.1.2",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
  {
    id: "6",
    userId: "teacher1",
    userName: "Professor Johnson",
    userRole: "teacher",
    action: "login_failure",
    details: {
      reason: "Invalid password",
      attemptTime: "2023-05-19T10:15:00Z",
    },
    timestamp: "2023-05-19T10:15:00Z",
    ipAddress: "192.168.1.3",
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "7",
    userId: "admin1",
    userName: "System Administrator",
    userRole: "global-admin",
    action: "user_create",
    details: {
      email: "teacher2@example.com",
      role: "teacher",
      specialization: ["Mathematics", "Physics"],
    },
    targetId: "teacher2",
    targetName: "Dr. Williams",
    targetRole: "teacher",
    timestamp: "2023-05-20T11:30:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "8",
    userId: "admin1",
    userName: "System Administrator",
    userRole: "global-admin",
    action: "user_activate",
    details: {
      userId: "student3",
      previousStatus: "inactive",
      newStatus: "active",
    },
    targetId: "student3",
    targetName: "Robert Brown",
    targetRole: "student",
    timestamp: "2023-05-21T14:00:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
];

interface AuditLogViewerProps {
  isGlobalAdmin?: boolean;
}

export function AuditLogViewer({ isGlobalAdmin = false }: AuditLogViewerProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterUserRole, setFilterUserRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Filter data based on action, userRole, and search query
  const filteredData = data.filter((log) => {
    // Filter by action
    if (filterAction !== "all" && log.action !== filterAction) {
      return false;
    }

    // Filter by user role
    if (filterUserRole !== "all" && log.userRole !== filterUserRole) {
      return false;
    }

    // Filter by date range
    if (startDate && endDate) {
      const logDate = new Date(log.timestamp);
      if (logDate < startDate || logDate > endDate) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(query) ||
        log.userId.toLowerCase().includes(query) ||
        (log.targetName && log.targetName.toLowerCase().includes(query)) ||
        (log.targetId && log.targetId.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const timestamp = new Date(row.getValue("timestamp"));
        return <div>{format(timestamp, "MMM d, yyyy h:mm a")}</div>;
      },
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => <div>{row.getValue("userName")}</div>,
    },
    {
      accessorKey: "userRole",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("userRole") as string;
        return (
          <Badge
            variant={
              role === "global-admin"
                ? "destructive"
                : role === "admin"
                ? "default"
                : "secondary"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
          "outline";

        if (action.includes("create")) {
          badgeVariant = "default";
        } else if (action.includes("update") || action.includes("password")) {
          badgeVariant = "secondary";
        } else if (
          action.includes("delete") ||
          action.includes("deactivate") ||
          action.includes("failure")
        ) {
          badgeVariant = "destructive";
        }

        return <Badge variant={badgeVariant}>{action.replace("_", " ")}</Badge>;
      },
    },
    {
      accessorKey: "targetName",
      header: "Target",
      cell: ({ row }) => <div>{row.getValue("targetName") || "N/A"}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const log = row.original;

        const handleViewDetails = () => {
          setSelectedLog(log);
          setIsDetailsOpen(true);
        };

        return (
          <Button variant="ghost" size="sm" onClick={handleViewDetails}>
            <Info className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const refreshData = () => {
    setIsLoading(true);

    // In a real app, you would fetch fresh data here
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Audit logs refreshed",
        description: "The audit log data has been updated.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            {isGlobalAdmin
              ? "View complete system activity and security events with advanced filtering"
              : "View system activity and security events"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isGlobalAdmin && (
            <Button
              variant="default"
              className="bg-[#e77f33] hover:bg-[#d06b25]"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          )}
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Filter audit logs by action, user role, date range, or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="action-filter" className="mb-2 block">
                Action
              </Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger id="action-filter">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="user_create">User Create</SelectItem>
                  <SelectItem value="user_update">User Update</SelectItem>
                  <SelectItem value="user_delete">User Delete</SelectItem>
                  <SelectItem value="user_password_reset">
                    Password Reset
                  </SelectItem>
                  <SelectItem value="user_deactivate">
                    User Deactivate
                  </SelectItem>
                  <SelectItem value="user_activate">User Activate</SelectItem>
                  <SelectItem value="login_success">Login Success</SelectItem>
                  <SelectItem value="login_failure">Login Failure</SelectItem>
                  {isGlobalAdmin && (
                    <>
                      <SelectItem value="system_setting">
                        System Settings
                      </SelectItem>
                      <SelectItem value="database_backup">
                        Database Backup
                      </SelectItem>
                      <SelectItem value="security_alert">
                        Security Alert
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role-filter" className="mb-2 block">
                User Role
              </Label>
              <Select value={filterUserRole} onValueChange={setFilterUserRole}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="global-admin">Global Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range" className="mb-2 block">
                Date Range
              </Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="search" className="mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by user or target"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center py-4 gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} audit log entries
        </div>
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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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

      {/* Log Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Timestamp</h3>
                  <p>{format(new Date(selectedLog.timestamp), "PPP p")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Action</h3>
                  <Badge>{selectedLog.action.replace("_", " ")}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">User</h3>
                  <p>
                    {selectedLog.userName} ({selectedLog.userId})
                  </p>
                  <Badge variant="outline">{selectedLog.userRole}</Badge>
                </div>
                {selectedLog.targetName && (
                  <div>
                    <h3 className="text-sm font-medium">Target</h3>
                    <p>
                      {selectedLog.targetName} ({selectedLog.targetId})
                    </p>
                    {selectedLog.targetRole && (
                      <Badge variant="outline">{selectedLog.targetRole}</Badge>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium">Details</h3>
                <pre className="mt-2 rounded-md bg-slate-950 p-4 overflow-x-auto text-xs text-white">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">IP Address</h3>
                  <p>{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">User Agent</h3>
                  <p className="truncate">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
