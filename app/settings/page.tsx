'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Settings, Users, Bell, Shield, Palette, Database, Download, Upload, RefreshCw, Key, Eye, Lock } from 'lucide-react'
import { useEmployeeStore } from '@/lib/store'
import { ModeToggle } from '@/components/mode-toggle'

export default function SettingsPage() {
  const { 
    employees, 
    clearBookmarks, 
    clearFilters, 
    itemsPerPage, 
    setItemsPerPage,
    setSearchTerm,
    setSelectedDepartment,
    setSelectedPerformanceRating,
    setCurrentPage,
    sortOrder,
    setSortOrder
  } = useEmployeeStore()
  
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting] = useState(false)
  const [dataRetention, setDataRetention] = useState('1-year')
  const [auditLogging, setAuditLogging] = useState(true)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState('5')
  
  // Notification settings
  const [newEmployeeAlerts, setNewEmployeeAlerts] = useState(true)
  const [performanceUpdates, setPerformanceUpdates] = useState(true)
  const [systemUpdates, setSystemUpdates] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

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
    // Reset preferences
    setItemsPerPage(12)
    setSortOrder('name-asc')
    setCurrentPage(1)
  }

  const handleResetAllSettings = () => {
    // Reset all preferences to defaults
    setItemsPerPage(12)
    setSortOrder('name-asc')
    setDataRetention('1-year')
    setAuditLogging(true)
    setEncryptionEnabled(true)
    setLoginAttempts('5')
    
    // Reset notifications
    setNewEmployeeAlerts(true)
    setPerformanceUpdates(true)
    setSystemUpdates(true)
    setEmailNotifications(true)
    setPushNotifications(false)
    
    // Clear store data
    clearBookmarks()
    clearFilters()
    setCurrentPage(1)
    setSearchTerm('')
    setSelectedDepartment(null)
    setSelectedPerformanceRating(null)
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value)
    setItemsPerPage(newItemsPerPage)
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
      <div className="space-y-6">
        {/* First Row - 2 columns */}
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
        </div>

        {/* Second Row - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 items</SelectItem>
                    <SelectItem value="12">12 items</SelectItem>
                    <SelectItem value="18">18 items</SelectItem>
                    <SelectItem value="24">24 items</SelectItem>
                    <SelectItem value="36">36 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Default sort order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
                    <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="performance">Performance Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default view mode</label>
                <Select defaultValue="grid">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select view mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid view</SelectItem>
                    <SelectItem value="list">List view</SelectItem>
                    <SelectItem value="table">Table view</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Switch 
                    checked={newEmployeeAlerts} 
                    onCheckedChange={setNewEmployeeAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Performance updates</p>
                    <p className="text-xs text-muted-foreground">
                      Notifications for performance rating changes
                    </p>
                  </div>
                  <Switch 
                    checked={performanceUpdates} 
                    onCheckedChange={setPerformanceUpdates} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">System updates</p>
                    <p className="text-xs text-muted-foreground">
                      Important system and feature updates
                    </p>
                  </div>
                  <Switch 
                    checked={systemUpdates} 
                    onCheckedChange={setSystemUpdates} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Push notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Browser push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Security (full width) */}
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <p className="text-sm font-medium">Password Requirements</p>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 ml-6">
                    <p>• Minimum 8 characters</p>
                    <p>• Must contain uppercase and lowercase letters</p>
                    <p>• Must contain at least one number</p>
                    <p>• Must contain at least one special character</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <p className="text-sm font-medium">Maximum login attempts</p>
                  </div>
                  <Select value={loginAttempts} onValueChange={setLoginAttempts}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select max attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <p className="text-sm font-medium">Data retention period</p>
                  </div>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-months">6 months</SelectItem>
                      <SelectItem value="1-year">1 year</SelectItem>
                      <SelectItem value="2-years">2 years</SelectItem>
                      <SelectItem value="5-years">5 years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <p className="text-sm font-medium">Audit logging</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Track user actions and system events
                    </p>
                  </div>
                  <Switch 
                    checked={auditLogging} 
                    onCheckedChange={setAuditLogging} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <p className="text-sm font-medium">Data encryption</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Encrypt sensitive data at rest
                    </p>
                  </div>
                  <Switch 
                    checked={encryptionEnabled} 
                    onCheckedChange={setEncryptionEnabled} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Single Sign-On (SSO)</p>
                    <p className="text-xs text-muted-foreground">
                      Enterprise authentication integration
                    </p>
                  </div>
                  <Badge variant="outline">Enterprise</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fourth Row - Reset & Clear (more compact) */}
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button 
                  onClick={handleClearData}
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear Bookmarks & Filters
                </Button>
                <p className="text-xs text-muted-foreground">
                  Clear saved bookmarks and active filters
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleResetAllSettings}
                  variant="destructive" 
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset All Settings
                </Button>
                <p className="text-xs text-muted-foreground">
                  Reset all settings to default values. Cannot be undone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
