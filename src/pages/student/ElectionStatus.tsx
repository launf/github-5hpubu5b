import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ElectionBanner } from '@/components/elections/ElectionBanner';
import { Vote, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ElectionStatus = () => {
  const { elections, endElection } = useData();
  const { user } = useAuth();
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  // Filter elections for student's course and session
  const myElections = elections.filter(
    (e) => e.course === user?.department && e.session === '2024-2025'
  );

  const liveElections = myElections.filter((e) => e.isLive);
  const upcomingElections = myElections.filter((e) => !e.isLive && !e.startTime);
  const completedElections = myElections.filter((e) => !e.isLive && e.startTime);

  const handleTimeEnd = (electionId: string) => {
    endElection(electionId);
  };

  const handleDismiss = (electionId: string) => {
    setDismissedBanners([...dismissedBanners, electionId]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Election Status</h1>
          <p className="text-muted-foreground">
            View and participate in elections for your class
          </p>
        </div>

        {/* Live Election Banners */}
        {liveElections.map((election) => (
          !dismissedBanners.includes(election.id) && (
            <ElectionBanner
              key={election.id}
              election={election}
              onTimeEnd={() => handleTimeEnd(election.id)}
              onDismiss={() => handleDismiss(election.id)}
            />
          )
        ))}

        {/* Live Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-green-600" />
              Live Elections
            </CardTitle>
            <CardDescription>
              Elections currently open for voting
            </CardDescription>
          </CardHeader>
          <CardContent>
            {liveElections.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No live elections at the moment
              </p>
            ) : (
              <div className="space-y-3">
                {liveElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-green-500/5 border-green-500/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{election.post}</h3>
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600">
                          <Clock className="w-3 h-3" />
                          Live
                        </span>
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Elections
            </CardTitle>
            <CardDescription>
              Elections scheduled to start soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingElections.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming elections
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{election.post}</h3>
                      <p className="text-sm text-muted-foreground">
                        {election.course} - {election.session}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {format(new Date(election.createdAt), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gray-600" />
              Completed Elections
            </CardTitle>
            <CardDescription>
              Elections that have ended
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedElections.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No completed elections
              </p>
            ) : (
              <div className="space-y-3">
                {completedElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card opacity-75"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{election.post}</h3>
                      <p className="text-sm text-muted-foreground">
                        {election.course} - {election.session}
                      </p>
                      {election.startTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ended: {format(new Date(election.startTime), 'PPp')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ElectionStatus;
