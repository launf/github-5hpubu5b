import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { BarChart3, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Votes = () => {
  const { votes, getCandidateById, candidates } = useData();
  
  const [filters, setFilters] = useState({
    post: 'all',
    session: '',
    course: 'all',
    section: ''
  });

  // Get unique values for filters
  const posts = Array.from(new Set(candidates.map(c => c.postEnum)));
  const courses = Array.from(new Set(candidates.map(c => c.course)));

  const filterVotes = (voteList: typeof votes) => {
    return voteList.filter(vote => {
      if (filters.post && filters.post !== 'all') {
        if (vote.votedForPost !== filters.post) return false;
      }
      if (filters.session && vote.session !== filters.session) return false;
      if (filters.course && filters.course !== 'all') {
        if (vote.course !== filters.course) return false;
      }
      if (filters.section && vote.section !== filters.section) return false;
      return true;
    });
  };

  const filteredVotes = filterVotes(votes);

  // Group votes by post
  const votesByPost = filteredVotes.reduce((acc, vote) => {
    if (!acc[vote.votedForPost]) {
      acc[vote.votedForPost] = [];
    }
    acc[vote.votedForPost].push(vote);
    return acc;
  }, {} as Record<string, typeof votes>);

  // Group votes by candidate
  const votesByCandidate = filteredVotes.reduce((acc, vote) => {
    if (!acc[vote.candidateId]) {
      acc[vote.candidateId] = [];
    }
    acc[vote.candidateId].push(vote);
    return acc;
  }, {} as Record<string, typeof votes>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Voting Reports</h1>
          <p className="text-muted-foreground">
            View and analyze voting data
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
              Filter votes by criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
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

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Votes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredVotes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Object.keys(votesByPost).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Candidates Voted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Object.keys(votesByCandidate).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="by-post">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="by-post">By Position</TabsTrigger>
            <TabsTrigger value="by-candidate">By Candidate</TabsTrigger>
          </TabsList>

          <TabsContent value="by-post" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Votes by Position
                </CardTitle>
                <CardDescription>
                  Vote counts for each position
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(votesByPost).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No votes found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(votesByPost).map(([post, postVotes]) => (
                      <div key={post} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{post}</h3>
                          <Badge>{postVotes.length} votes</Badge>
                        </div>
                        <div className="space-y-2">
                          {postVotes.slice(0, 5).map((vote) => {
                            const candidate = getCandidateById(vote.candidateId);
                            return (
                              <div key={vote.id} className="text-sm flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  {format(new Date(vote.votedAt), 'PP p')}
                                </span>
                                <span>{candidate?.candidateName || 'Unknown'}</span>
                              </div>
                            );
                          })}
                          {postVotes.length > 5 && (
                            <p className="text-xs text-muted-foreground text-center pt-2">
                              +{postVotes.length - 5} more votes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-candidate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Votes by Candidate
                </CardTitle>
                <CardDescription>
                  Vote counts for each candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(votesByCandidate).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No votes found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(votesByCandidate)
                      .sort(([, a], [, b]) => b.length - a.length)
                      .map(([candidateId, candidateVotes]) => {
                        const candidate = getCandidateById(candidateId);
                        return (
                          <div key={candidateId} className="border rounded-lg p-4">
                            <div className="flex items-center gap-4">
                              {candidate?.imageUrl && (
                                <img
                                  src={candidate.imageUrl}
                                  alt={candidate.candidateName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold">{candidate?.candidateName || 'Unknown'}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {candidate?.postEnum} | {candidate?.studentId}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-lg px-4 py-2">
                                {candidateVotes.length} votes
                              </Badge>
                            </div>
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

export default Votes;
