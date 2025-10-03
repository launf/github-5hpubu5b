import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Calendar, Trophy, CircleCheck as CheckCircle2, Clock, Users, CircleAlert as AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { MOCK_DURATION_MIN } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { elections, candidates, castVote, hasVotedForPost, votes } = useData();

  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);

  // Get live elections for student's session and course
  const liveElections = elections.filter(
    e => e.isLive &&
         e.session === user?.session &&
         e.course === user?.department
  );

  // Get candidates for live elections filtered by student's session, course, and section
  const getElectionCandidates = (post: string) => {
    return candidates.filter(
      c => c.isApproved &&
           c.postEnum === post &&
           c.session === user?.session &&
           c.course === user?.department &&
           c.section === user?.section
    );
  };

  // Calculate remaining time for election
  const getRemainingTime = (startTime: Date | null) => {
    if (!startTime) return 'Not started';

    const now = new Date();
    const endTime = new Date(startTime.getTime() + MOCK_DURATION_MIN * 60000);
    const remaining = endTime.getTime() - now.getTime();

    if (remaining <= 0) return 'Ended';

    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  // Check if student has voted for a post
  const hasVoted = (post: string) => {
    return hasVotedForPost(user?.studentId || '', post);
  };

  // Count total votes cast by student
  const totalVotesCast = votes.filter(v => v.voterId === user?.studentId).length;

  // Count pending votes
  const pendingVotes = liveElections.filter(e => !hasVoted(e.post)).length;

  const stats = [
    { label: 'Active Elections', value: liveElections.length.toString(), icon: Vote, color: 'bg-blue-500' },
    { label: 'My Votes Cast', value: totalVotesCast.toString(), icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Pending Votes', value: pendingVotes.toString(), icon: Clock, color: 'bg-orange-500' }
  ];

  const openVoteDialog = (electionPost: string) => {
    const electionCandidates = getElectionCandidates(electionPost);

    // Check if student has already voted
    if (hasVoted(electionPost)) {
      toast({
        title: 'Already Voted',
        description: 'You have already voted for this post.',
        variant: 'destructive'
      });
      return;
    }

    // Check if there are candidates
    if (electionCandidates.length === 0) {
      toast({
        title: 'No Candidates',
        description: 'There are no approved candidates for this election in your class.',
        variant: 'destructive'
      });
      return;
    }

    setSelectedElection(electionPost);
    setSelectedCandidate('');
    setIsVoteDialogOpen(true);
  };

  const handleVote = () => {
    if (!selectedCandidate || !selectedElection) {
      toast({
        title: 'Error',
        description: 'Please select a candidate',
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
      selectedElection,
      user.session,
      user.department,
      user.section
    );

    if (success) {
      toast({
        title: 'Vote Cast Successfully',
        description: `Your vote for ${selectedElection} has been recorded.`
      });
      setIsVoteDialogOpen(false);
      setSelectedElection(null);
      setSelectedCandidate('');
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Student ID: {user?.studentId} • {user?.department}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Active Elections
            </CardTitle>
            <CardDescription>
              Elections currently open for voting in your class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {liveElections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No active elections available at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveElections.map((election) => {
                  const electionCandidates = getElectionCandidates(election.post);
                  const voted = hasVoted(election.post);
                  const remainingTime = getRemainingTime(election.startTime);

                  return (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{election.post}</h3>
                          {voted && (
                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600">
                              <CheckCircle2 className="w-3 h-3" />
                              Voted
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {election.course} - Session {election.session}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {electionCandidates.length} candidate{electionCandidates.length !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ends in {remainingTime}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={voted ? "outline" : "default"}
                        className={!voted ? "bg-gradient-to-r from-[hsl(199,89%,48%)] to-[hsl(199,89%,58%)]" : ""}
                        onClick={() => openVoteDialog(election.post)}
                        disabled={voted}
                      >
                        {voted ? 'Already Voted' : 'Vote Now'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vote Dialog */}
        <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cast Your Vote for {selectedElection}</DialogTitle>
              <DialogDescription>
                Select a candidate from your class to vote for
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto py-4">
              {selectedElection && getElectionCandidates(selectedElection).map((candidate) => (
                <div
                  key={candidate.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCandidate === candidate.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-start gap-3">
                    {candidate.imageUrl ? (
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.candidateName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                        {candidate.candidateName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{candidate.candidateName}</h4>
                        {selectedCandidate === candidate.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        ID: {candidate.studentId} | Section: {candidate.section}
                      </p>
                      <p className="text-sm line-clamp-2">{candidate.manifesto}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleVote} disabled={!selectedCandidate}>
                <Vote className="w-4 h-4 mr-2" />
                Cast Vote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { text: 'Voted in Sports Captain election', time: '2 hours ago' },
                { text: 'Viewed candidates for Class Rep election', time: '1 day ago' },
                { text: 'Profile updated', time: '3 days ago' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <p className="text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
