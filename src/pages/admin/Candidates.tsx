import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { UserCheck, CheckCircle, XCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Candidates = () => {
  const { candidates, toggleCandidateApproval } = useData();
  
  const [filters, setFilters] = useState({
    post: 'all',
    session: '',
    course: 'all',
    section: ''
  });

  const approvedCandidates = candidates.filter(c => c.isApproved);
  const unapprovedCandidates = candidates.filter(c => !c.isApproved);

  const filterCandidates = (candidateList: typeof candidates) => {
    return candidateList.filter(candidate => {
      if (filters.post && filters.post !== 'all' && candidate.postEnum !== filters.post) return false;
      if (filters.session && candidate.session !== filters.session) return false;
      if (filters.course && filters.course !== 'all' && candidate.course !== filters.course) return false;
      if (filters.section && candidate.section !== filters.section) return false;
      return true;
    });
  };

  const handleToggleApproval = (id: string, name: string, isApproved: boolean) => {
    toggleCandidateApproval(id);
    toast({
      title: isApproved ? 'Candidate Unapproved' : 'Candidate Approved',
      description: `${name} has been ${isApproved ? 'unapproved' : 'approved'}`
    });
  };

  const CandidateTable = ({ candidateList, showApproveButton }: { candidateList: typeof candidates; showApproveButton: boolean }) => {
    const filteredList = filterCandidates(candidateList);

    return (
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Candidate</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Post</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Course</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Section</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Votes</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Applied</th>
                <th className="text-left p-2 sm:p-4 font-semibold whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    No candidates found
                  </td>
                </tr>
              ) : (
                filteredList.map((candidate) => (
                  <tr key={candidate.id} className="border-t hover:bg-muted/30">
                    <td className="p-2 sm:p-4">
                      <div>
                        <p className="font-medium whitespace-nowrap text-sm sm:text-base">{candidate.candidateName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{candidate.studentId}</p>
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 whitespace-nowrap text-sm sm:text-base">{candidate.postEnum}</td>
                    <td className="p-2 sm:p-4 whitespace-nowrap text-sm sm:text-base">{candidate.course}</td>
                    <td className="p-2 sm:p-4 whitespace-nowrap text-sm sm:text-base">{candidate.section}</td>
                    <td className="p-2 sm:p-4 whitespace-nowrap">
                      <Badge variant="outline">{candidate.totalVote}</Badge>
                    </td>
                    <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(candidate.createdAt), 'PP')}
                    </td>
                    <td className="p-2 sm:p-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant={showApproveButton ? "default" : "destructive"}
                        onClick={() => handleToggleApproval(candidate.id, candidate.candidateName, candidate.isApproved)}
                        className="text-xs sm:text-sm"
                      >
                        {showApproveButton ? (
                          <>
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Unapprove</span>
                            <span className="sm:hidden">✗</span>
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Candidate Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Review and approve candidate applications
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
              Filter candidates by criteria
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
                    <SelectValue placeholder="All posts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All posts</SelectItem>
                    <SelectItem value="Class Representative">Class Representative</SelectItem>
                    <SelectItem value="Sports Captain">Sports Captain</SelectItem>
                    <SelectItem value="Cultural Committee Head">Cultural Committee Head</SelectItem>
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
                    <SelectValue placeholder="All courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All courses</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="MCA">MCA</SelectItem>
                    <SelectItem value="BSc">BSc</SelectItem>
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
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setFilters({ post: 'all', session: '', course: 'all', section: '' })}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Candidate Lists */}
        <Tabs defaultValue="unapproved">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unapproved">
              Pending Approval ({unapprovedCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedCandidates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unapproved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                  Pending Approval
                </CardTitle>
                <CardDescription>
                  Candidates awaiting approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CandidateTable candidateList={unapprovedCandidates} showApproveButton={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Approved Candidates
                </CardTitle>
                <CardDescription>
                  Candidates approved for election
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CandidateTable candidateList={approvedCandidates} showApproveButton={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
