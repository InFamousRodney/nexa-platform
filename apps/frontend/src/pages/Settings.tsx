import { SidebarLayout } from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ConnectOrgButton } from "@/components/salesforce/ConnectOrgButton";

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
                      <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="connections" className="h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Connected Salesforce Organizations</h2>
                    <p className="text-muted-foreground mb-4">Manage your Salesforce org connections</p>
                    <ConnectOrgButton />
                  </div>
                  
                  <div className="border rounded-lg divide-y">
                    {/* Connection items will be rendered here */}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="h-full">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Theme</h2>
                  <p className="text-muted-foreground mb-4">Select your preferred theme</p>
                  <ThemeToggle />
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
