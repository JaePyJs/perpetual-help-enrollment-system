"use client"

import { AuditLogViewer } from "@/components/admin/audit-log-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AuditLogsPage() {
  const { user } = useAuth()
  
  // Check if current user is a global admin or regular admin
  const isAdmin = user?.role === "admin" || user?.role === "global-admin"

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have permission to view audit logs
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <Shield className="h-5 w-5" />
              Restricted Area
            </CardTitle>
            <CardDescription>
              This section is only accessible to administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              If you believe you should have access to this page, please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          View and monitor system activity and security events
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Security Audit Trail
          </CardTitle>
          <CardDescription>
            Complete record of user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The audit log provides a comprehensive record of all actions performed in the system, including user creation, updates, password resets, and login attempts. Use the filters below to narrow down the results.
          </p>
        </CardContent>
      </Card>
      
      <AuditLogViewer />
    </div>
  )
}
