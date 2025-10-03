import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { Users, Filter } from 'lucide-react';

const ViewCandidates = () => {
  const { candidates } = useData();
  const { user } = useAuth();
  
  const [selectedPost, setSelectedPost] = useState('all');

  // Filter approved candidates for student's session, course, and section
  const approvedCandidates = candidates.filter(
    c => c.isApproved &&
         c.course === user?.department &&
         c.session === user?.session &&
         c.section === user?.section
  );

  const filteredCandidates = selectedPost === 'all' 
    ? approvedCandidates 
    : approvedCandidates.filter(c => c.postEnum === selectedPost);

  const posts = Array.from(new Set(approvedCandidates.map(c => c.postEnum)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">View Candidates</h1>
          <p className="text-muted-foreground">
            Browse candidates running in your elections
          </p>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Position
            </CardTitle>
            <CardDescription>
              View candidates for specific positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="post-filter">Position</Label>
              <Select value={selectedPost} onValueChange={setSelectedPost}>
                <SelectTrigger id="post-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {posts.map((post) => (
                    <SelectItem key={post} value={post}>
                      {post}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedPost === 'all' ? 'All Candidates' : selectedPost}
            </CardTitle>
            <CardDescription>
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No candidates available for this position yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ViewCandidates;
