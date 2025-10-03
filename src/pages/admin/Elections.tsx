import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Vote, Play, Square, Trash2, RotateCcw, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Elections = () => {
  const { elections, createElection, startElection, endElection, deleteElection, resetElections } = useData();
  const { user } = useAuth();
  
  const [newElection, setNewElection] = useState({
    session: '',
    course: '',
    post: ''
  });

  const [resetFilters, setResetFilters] = useState({
    session: '',
    course: '',
    post: '',
    section: ''
  });

  const handleCreateElection = () => {
    if (!newElection.session || !newElection.course || !newElection.post) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive'
      });
      return;
    }

    createElection({
      ...newElection,
      createdBy: user?.id || 'admin_001'
    });

    toast({
      title: 'Success',
      description: 'Election created successfully'
    });

    setNewElection({ session: '', course: '', post: '' });
  };

  const handleStartElection = (id: string, post: string) => {
    startElection(id);
    toast({
      title: 'Election Started',
      description: `${post} election is now live!`
    });
  };

  const handleEndElection = (id: string, post: string) => {
    endElection(id);
    toast({
      title: 'Election Ended',
      description: `${post} election has been closed`
    });
  };

  const handleDeleteElection = (id: string) => {
    deleteElection(id);
    toast({
      title: 'Deleted',
      description: 'Election removed successfully'
    });
  };

  const handleReset = () => {
    resetElections(resetFilters);
    toast({
      title: 'Elections Reset',
      description: 'Matching elections have been removed'
    });
    setResetFilters({ session: '', course: '', post: '', section: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Election Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and monitor elections
          </p>
        </div>

        {/* Create Election */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Create New Election
            </CardTitle>
            <CardDescription>
              Set up a new election for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Input
                  id="session"
                  placeholder="e.g., 2024-2025"
                  value={newElection.session}
                  onChange={(e) => setNewElection({ ...newElection, session: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={newElection.course}
                  onValueChange={(value) => setNewElection({ ...newElection, course: value })}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="MCA">MCA</SelectItem>
                    <SelectItem value="BSc">BSc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post">Post</Label>
                <Input
                  id="post"
                  placeholder="e.g., Class Representative"
                  value={newElection.post}
                  onChange={(e) => setNewElection({ ...newElection, post: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleCreateElection} className="mt-4">
              Create Election
            </Button>
          </CardContent>
        </Card>

        {/* Elections List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Elections</CardTitle>
            <CardDescription>
              Manage all elections in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {elections.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No elections created yet
                </p>
              ) : (
                elections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{election.post}</h3>
                        {election.isLive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600">
                            <Clock className="w-3 h-3" />
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {election.course} - {election.session}
                      </p>
                      {election.startTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {format(new Date(election.startTime), 'PPp')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!election.isLive ? (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStartElection(election.id, election.post)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleEndElection(election.id, election.post)}
                        >
                          <Square className="w-4 h-4 mr-1" />
                          End
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteElection(election.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reset Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset Elections
            </CardTitle>
            <CardDescription>
              Remove elections matching specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="reset-session">Session</Label>
                <Input
                  id="reset-session"
                  placeholder="2024-2025"
                  value={resetFilters.session}
                  onChange={(e) => setResetFilters({ ...resetFilters, session: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-course">Course</Label>
                <Input
                  id="reset-course"
                  placeholder="BCA"
                  value={resetFilters.course}
                  onChange={(e) => setResetFilters({ ...resetFilters, course: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-post">Post</Label>
                <Input
                  id="reset-post"
                  placeholder="Class Rep"
                  value={resetFilters.post}
                  onChange={(e) => setResetFilters({ ...resetFilters, post: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-section">Section</Label>
                <Input
                  id="reset-section"
                  placeholder="A"
                  value={resetFilters.section}
                  onChange={(e) => setResetFilters({ ...resetFilters, section: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleReset} variant="destructive" className="mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Elections
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Elections;
