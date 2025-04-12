
import { SidebarLayout } from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "connections" | "appearance">("profile");
  
  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <SidebarTrigger />
        </header>
        
        <div className="flex-1 glass-card p-4 rounded-lg overflow-hidden">
          <Tabs 
            defaultValue="profile" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "profile" | "connections" | "appearance")}
            className="h-full flex flex-col"
          >
            <div className="flex justify-start items-center mb-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="connections">Salesforce Connections</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="profile" className="h-full">
                <div className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <input id="email" type="email" className="w-full px-3 py-2 rounded-md border border-input bg-background" defaultValue="user@example.com" disabled />
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input id="name" type="text" className="w-full px-3 py-2 rounded-md border border-input bg-background" defaultValue="John Doe" />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-3">Change Password</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
                          <input id="currentPassword" type="password" className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                          <input id="newPassword" type="password" className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
                          <input id="confirmPassword" type="password" className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="connections" className="h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Connected Salesforce Orgs</h3>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-5 gap-2 p-3 font-medium bg-muted text-muted-foreground text-sm">
                        <div>Org ID</div>
                        <div>Instance URL</div>
                        <div>Connected On</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 p-3 border-t">
                        <div className="text-sm">00D1y000000ABCD</div>
                        <div className="text-sm">https://na139.salesforce.com</div>
                        <div className="text-sm">2023-04-15</div>
                        <div className="text-sm">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="text-sm flex gap-2">
                          <button className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">Test</button>
                          <button className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs">Disconnect</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                      Connect New Salesforce Org
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="h-full">
                <div className="max-w-md">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Theme</h3>
                      <div className="flex items-center">
                        <span className="mr-4">Toggle theme:</span>
                        <ThemeToggle />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="emailNotifs" className="mr-2" defaultChecked />
                          <label htmlFor="emailNotifs">Email Notifications</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="analysisComplete" className="mr-2" defaultChecked />
                          <label htmlFor="analysisComplete">Analysis Completion</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="snapshotFailed" className="mr-2" defaultChecked />
                          <label htmlFor="snapshotFailed">Snapshot Failures</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
