'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, Users, Bell, Shield, Palette, Database, Download, Upload, RefreshCw } from 'lucide-react'
import { useEmployeeStore } from '@/lib/store'
import { ModeToggle } from '@/components/mode-toggle'

export default function SettingsPage() {
  const { employees, clearBookmarks, clearFilters } = useEmployeeStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const dataToExport = {
        employees,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hr-dashboard-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearData = () => {
    clearBookmarks()
    clearFilters()
    // You could add more cleanup here
  }

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your HR dashboard preferences and data
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Choose between light and dark mode
                </p>
              </div>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Import, export, and manage your employee data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={handleExportData} 
                disabled={isExporting || employees.length === 0}
                className="w-full gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Employee Data'}
              </Button>
              
              <Button 
                disabled={isImporting}
                className="w-full gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                Import Employee Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Preferences
            </CardTitle>
            <CardDescription>
              Configure your personal dashboard preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Items per page</label>
              <Input
                type="number"
                defaultValue="12"
                min="6"
                max="50"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Default sort order</label>
              <select className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background">
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Salary (High to Low)</option>
                <option>Salary (Low to High)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">New employee alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new employees are added
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Performance updates</p>
                  <p className="text-xs text-muted-foreground">
                    Notifications for performance rating changes
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">System updates</p>
                  <p className="text-xs text-muted-foreground">
                    Important system and feature updates
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage security settings and data privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Session timeout</p>
                <select className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>Never</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset & Clear Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Reset & Clear
            </CardTitle>
            <CardDescription>
              Reset preferences or clear stored data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={handleClearData}
                variant="outline" 
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Bookmarks & Filters
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                disabled
              >
                <RefreshCw className="h-4 w-4" />
                Reset All Settings
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Reset will restore all settings to their default values. This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and version information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">HR Dashboard v1.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Employee Records</p>
              <p className="font-medium">{employees.length} employees loaded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
