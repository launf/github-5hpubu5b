import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { Trophy, Plus, Trash2, Filter } from 'lucide-react';

const Winners = () => {
  const { candidates, winners, saveWinner, removeWinner, getCandidateById } = useData();
  
  const [filters, setFilters] = useState({
    session: '',
    course: 'all',
    post: 'all',
    section: ''
  });

  const [selectedCandidate, setSelectedCandidate] = useState('');

  // Get approved candidates sorted by votes
  const approvedCandidates = candidates
    .filter(c => c.isApproved && !c.isWinner)
    .sort((a, b) => b.totalVote - a.totalVote);

  // Get unique values
  const posts = Array.from(new Set(candidates.map(c => c.postEnum)));
  const courses = Array.from(new Set(candidates.map(c => c.course)));

  // Filter winners
  const filteredWinners = winners.filter(winner => {
    if (filters.session && winner.session !== filters.session) return false;
    if (filters.course && filters.course !== 'all' && winner.course !== filters.course) return false;
    if (filters.post && filters.post !== 'all' && winner.post !== filters.post) return false;
    if (filters.section && winner.section !== filters.section) return false;
    return true;
  });

  // Filter candidates
  const filteredCandidates = approvedCandidates.filter(candidate => {
    if (filters.session && candidate.session !== filters.session) return false;
    if (filters.course && filters.course !== 'all' && candidate.course !== filters.course) return false;
    if (filters.post && filters.post !== 'all' && candidate.postEnum !== filters.post) return false;
    if (filters.section && candidate.section !== filters.section) return false;
    return true;
  });

  const handleSaveWinner = () => {
    if (!selectedCandidate) {
      toast({
        title: 'Error',
        description: 'Please select a candidate',
        variant: 'destructive'
      });
      return;
    }

    saveWinner(selectedCandidate);
    toast({
      title: 'Winner Saved',
      description: 'Winner has been recorded successfully'
    });
    setSelectedCandidate('');
  };

  const handleRemoveWinner = (winnerId: string, winnerName: string) => {
    removeWinner(winnerId);
    toast({
      title: 'Winner Removed',
      description: `${winnerName} has been removed from winners`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Winners Management</h1>
          <p className="text-muted-foreground">
            Declare and manage election winners
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter by criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="filter-session">Session</Label>
                <Input
                  id="filter-session"
                  placeholder="e.g., 2024-2025"
                  value={filters.session}
                  onChange={(e) => setFilters({ ...filters, session: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-course">Course</Label>
                <Select
                  value={filters.course}
                  onValueChange={(value) => setFilters({ ...filters, course: value })}
                >
                  <SelectTrigger id="filter-course">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-post">Post</Label>
                <Select
                  value={filters.post}
                  onValueChange={(value) => setFilters({ ...filters, post: value })}
                >
                  <SelectTrigger id="filter-post">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All posts</SelectItem>
                    {posts.map((post) => (
                      <SelectItem key={post} value={post}>
                        {post}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-section">Section</Label>
                <Input
                  id="filter-section"
                  placeholder="e.g., A"
                  value={filters.section}
                  onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="declare">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="declare">Declare Winner</TabsTrigger>
            <TabsTrigger value="view">View Winners ({filteredWinners.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="declare" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Declare Winner
                </CardTitle>
                <CardDescription>
                  Select a candidate to declare as winner
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No eligible candidates found. Apply filters or approve candidates first.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {filteredCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedCandidate === candidate.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-muted-foreground'
                          }`}
                          onClick={() => setSelectedCandidate(candidate.id)}
                        >
                          <div className="flex items-center gap-4">
                            {candidate.imageUrl && (
                              <img
                                src={candidate.imageUrl}
                                alt={candidate.candidateName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold">{candidate.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {candidate.postEnum} | {candidate.studentId} | Section {candidate.section}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {candidate.course} - {candidate.session}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-lg px-3 py-1">
                                {candidate.totalVote} votes
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleSaveWinner}
                      disabled={!selectedCandidate}
                      className="w-full"
                      size="lg"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Declare as Winner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Current Winners
                </CardTitle>
                <CardDescription>
                  {filteredWinners.length} winner{filteredWinners.length !== 1 ? 's' : ''} declared
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredWinners.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No winners declared yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredWinners.map((winner) => {
                      const candidate = getCandidateById(winner.candidateId);
                      return (
                        <div
                          key={winner.id}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg border border-yellow-200"
                        >
                          <Trophy className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                          {candidate?.imageUrl && (
                            <img
                              src={candidate.imageUrl}
                              alt={winner.studentName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">{winner.studentName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {winner.post} | {winner.studentId} | Section {winner.section}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {winner.course} - {winner.session}
                            </p>
                            {candidate && (
                              <Badge variant="outline" className="mt-1">
                                {candidate.totalVote} votes
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveWinner(winner.id, winner.studentName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Winners;
