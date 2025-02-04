"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { Code, GitBranch, GitCommit, GitPullRequest, Terminal } from "lucide-react"

export default function DevelopmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Development</h1>
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">main</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Current development progress and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Features</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Build Status</CardTitle>
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">Passing</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest development updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Updated mobile navigation",
                      description: "Improved mobile UI/UX with new bottom navigation",
                      time: "2 hours ago",
                    },
                    {
                      title: "Added development dashboard",
                      description: "New development metrics and monitoring page",
                      time: "5 hours ago",
                    },
                    {
                      title: "Fixed sidebar issues",
                      description: "Resolved mobile sidebar layout problems",
                      time: "1 day ago",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <GitCommit className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Features</CardTitle>
                <CardDescription>Features in development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Enhanced AI Assistant",
                      status: "In Progress",
                      completion: "70%",
                    },
                    {
                      title: "Real-time Chat",
                      status: "Planning",
                      completion: "20%",
                    },
                    {
                      title: "Advanced Analytics",
                      status: "Review",
                      completion: "90%",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.completion}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div className={`h-full rounded-full bg-primary w-[${item.completion}]`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          {/* Add feature management content */}
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          {/* Add documentation content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

