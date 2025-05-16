"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Settings, Database, Server, Lock, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function SystemSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  // Check if current user is a global admin
  const isGlobalAdmin = user?.role === "global-admin";

  // If not a global admin, redirect to dashboard
  if (!isGlobalAdmin) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to access this page
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <ShieldAlert className="h-5 w-5" />
                Global Admin Access Required
              </CardTitle>
              <CardDescription>
                This section is restricted to Global Administrators only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Restricted Access</AlertTitle>
                <AlertDescription>
                  You need Global Administrator privileges to access the System Settings section.
                  Please contact a Global Administrator if you need access to this feature.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button onClick={() => router.push("/admin/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="global-admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure global system settings and security options
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="mr-2 h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="api">
              <Globe className="mr-2 h-4 w-4" />
              API & Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will be in maintenance mode and only administrators can access it.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Perpetual Help College Enrollment System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">System Contact Email</Label>
                  <Input id="contact-email" defaultValue="admin@phcm.edu.ph" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure system security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Require Two-Factor Authentication for Admins</Label>
                    <Switch id="two-factor" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-expiry">Password Expiry</Label>
                    <Switch id="password-expiry" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, passwords will expire after 90 days.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>
                  Configure database settings and backup options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will automatically backup the database daily.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
                <div className="mt-4">
                  <Button>
                    <Database className="mr-2 h-4 w-4" />
                    Create Manual Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API & Integration Settings</CardTitle>
                <CardDescription>
                  Configure API settings and external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-enabled">Enable API Access</Label>
                    <Switch id="api-enabled" defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" defaultValue="sk_test_api_key_123456789" type="password" />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                    <Switch id="webhook-enabled" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
