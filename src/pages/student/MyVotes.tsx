import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const MyVotes = () => {
  const { votes, getCandidateById } = useData();
  const { user } = useAuth();

  const myVotes = votes.filter(v => v.voterId === user?.studentId);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Votes</h1>
          <p className="text-muted-foreground">
            View your voting history
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Vote History
            </CardTitle>
            <CardDescription>
              {myVotes.length} vote{myVotes.length !== 1 ? 's' : ''} cast
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myVotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>You haven't cast any votes yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myVotes.map((vote) => {
                  const candidate = getCandidateById(vote.candidateId);
                  return (
                    <div
                      key={vote.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{vote.votedForPost}</Badge>
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(vote.votedAt), 'PP')}
                            </Badge>
                          </div>
                          {candidate && (
                            <div className="flex items-center gap-3">
                              {candidate.imageUrl && (
                                <img
                                  src={candidate.imageUrl}
                                  alt={candidate.candidateName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <p className="font-semibold">{candidate.candidateName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.studentId} | Section {candidate.section}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyVotes;
