import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Users } from 'lucide-react';

const Winners = () => {
  const { winners, getCandidateById } = useData();
  const { user } = useAuth();

  // Filter winners for student's class
  const myClassWinners = winners.filter(
    w => w.session === user?.session && 
         w.course === user?.department && 
         w.section === user?.section
  );

  // Group by post
  const winnersByPost = myClassWinners.reduce((acc, winner) => {
    if (!acc[winner.post]) {
      acc[winner.post] = [];
    }
    acc[winner.post].push(winner);
    return acc;
  }, {} as Record<string, typeof myClassWinners>);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Election Winners</h1>
          <p className="text-muted-foreground">
            View winners from your class elections
          </p>
        </div>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Class</p>
                <p className="font-semibold text-lg">
                  {user?.department} - Section {user?.section} ({user?.session})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(winnersByPost).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No winners announced yet for your class</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(winnersByPost).map(([post, postWinners]) => (
              <Card key={post}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    {post}
                  </CardTitle>
                  <CardDescription>
                    Winner{postWinners.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {postWinners.map((winner) => {
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
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{winner.studentName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {winner.studentId} | Section {winner.section}
                            </p>
                            {candidate && (
                              <Badge variant="outline" className="mt-2">
                                {candidate.totalVote} votes
                              </Badge>
                            )}
                          </div>
                          <Badge className="bg-yellow-600 hover:bg-yellow-700">
                            Winner
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Winners;
