import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Vote, UserCheck, TrendingUp, Calendar, CheckCircle2, Shield, UserCircle } from 'lucide-react';
import AdminForm from '@/components/admin/AdminForm';
import AdminList from '@/components/admin/AdminList';
import StudentForm from '@/components/admin/StudentForm';
import StudentList from '@/components/admin/StudentList';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Elections',
      value: '3',
      change: '2 ending soon',
      icon: Vote,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Candidates',
      value: '45',
      change: '+5 this week',
      icon: UserCheck,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Voter Turnout',
      value: '78%',
      change: '+3% from last',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentElections = [
    { name: 'Class Representative 2024', status: 'Active', votes: 456, ends: '2 days' },
    { name: 'Student Union President', status: 'Upcoming', votes: 0, ends: '5 days' },
    { name: 'Sports Captain', status: 'Active', votes: 234, ends: '1 day' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your elections.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Elections */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Elections
                  </CardTitle>
                  <CardDescription>
                    Overview of ongoing and upcoming elections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentElections.map((election, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{election.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {election.votes} votes • Ends in {election.ends}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          election.status === 'Active' 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {election.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a
                      href="/admin/elections"
                      className="block w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Manage Elections
                    </a>
                    {[
                      'Add New Candidate',
                      'Review Pending Applications',
                      'Generate Reports',
                      'Manage Student Records'
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminForm />
              <AdminList />
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentForm />
            <StudentList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
