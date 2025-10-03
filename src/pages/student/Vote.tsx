import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Vote as VoteIcon, CircleCheck as CheckCircle, Users } from 'lucide-react';

const Vote = () => {
  const { candidates, castVote, hasVotedForPost } = useData();
  const { user } = useAuth();
  
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');

  // Get approved candidates for student's session, course, and section
  const approvedCandidates = candidates.filter(
    c => c.isApproved &&
         c.course === user?.department &&
         c.session === user?.session &&
         c.section === user?.section
  );

  // Get unique posts
  const posts = Array.from(new Set(approvedCandidates.map(c => c.postEnum)));

  // Filter candidates by selected post
  const filteredCandidates = selectedPost
    ? approvedCandidates.filter(c => c.postEnum === selectedPost)
    : [];

  const alreadyVoted = selectedPost && hasVotedForPost(user?.studentId || '', selectedPost);

  const handleVote = () => {
    if (!selectedPost || !selectedCandidate) {
      toast({
        title: 'Error',
        description: 'Please select a position and candidate',
        variant: 'destructive'
      });
      return;
    }

    if (!user?.studentId || !user?.session || !user?.department || !user?.section) {
      toast({
        title: 'Error',
        description: 'User information not found',
        variant: 'destructive'
      });
      return;
    }

    // Verify candidate belongs to student's class
    const candidate = candidates.find(c => c.id === selectedCandidate);
    if (!candidate ||
        candidate.session !== user.session ||
        candidate.course !== user.department ||
        candidate.section !== user.section) {
      toast({
        title: 'Invalid Vote',
        description: 'You can only vote for candidates of your own class, course, section, and session.',
        variant: 'destructive'
      });
      return;
    }

    const success = castVote(
      user.studentId,
      selectedCandidate,
      selectedPost,
      user.session,
      user.department,
      user.section
    );

    if (success) {
      toast({
        title: 'Vote Cast Successfully',
        description: `Your vote for ${selectedPost} has been recorded.`
      });
      setSelectedCandidate('');
      setSelectedPost('');
    } else {
      toast({
        title: 'Already Voted',
        description: 'You have already voted for this post.',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
          <p className="text-muted-foreground">
            Vote for candidates in the student elections
          </p>
        </div>

        {/* Position Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VoteIcon className="w-5 h-5" />
              Select Position
            </CardTitle>
            <CardDescription>
              Choose the position you want to vote for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post">Position</Label>
                <Select value={selectedPost} onValueChange={setSelectedPost}>
                  <SelectTrigger id="post">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {posts.map((post) => (
                      <SelectItem key={post} value={post}>
                        {post}
                        {hasVotedForPost(user?.studentId || '', post) && (
                          <Badge variant="outline" className="ml-2">Voted</Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {alreadyVoted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">You have already voted for this position</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Candidates */}
        {selectedPost && !alreadyVoted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Candidates for {selectedPost}
              </CardTitle>
              <CardDescription>
                {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No candidates available for this position</p>
                </div>
              ) : (
                <div className="space-y-4">
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
                      <div className="flex items-start gap-4">
                        {candidate.imageUrl && (
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.candidateName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{candidate.candidateName}</h3>
                            {selectedCandidate === candidate.id && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            ID: {candidate.studentId} | Section: {candidate.section}
                          </p>
                          <p className="text-sm">{candidate.manifesto}</p>
                          <div className="mt-2">
                            <Badge variant="outline">
                              {candidate.totalVote} vote{candidate.totalVote !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleVote}
                    disabled={!selectedCandidate}
                    className="w-full"
                    size="lg"
                  >
                    <VoteIcon className="w-4 h-4 mr-2" />
                    Cast Vote
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Vote;
