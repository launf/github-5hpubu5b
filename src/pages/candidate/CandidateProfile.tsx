import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserCircle, Trophy, ThumbsUp, Save } from 'lucide-react';

const CandidateProfile = () => {
  const { candidates, updateCandidateProfile } = useData();
  const { user } = useAuth();
  
  const myCandidate = candidates.find(c => c.studentId === user?.studentId);
  
  const [manifesto, setManifesto] = useState(myCandidate?.manifesto || '');

  useEffect(() => {
    if (myCandidate) {
      setManifesto(myCandidate.manifesto);
    }
  }, [myCandidate]);

  const handleSave = () => {
    if (!myCandidate) return;

    if (!myCandidate.isApproved) {
      toast({
        title: 'Not Approved',
        description: 'You can only edit your manifesto after approval',
        variant: 'destructive'
      });
      return;
    }

    updateCandidateProfile(myCandidate.id, { manifesto });

    toast({
      title: 'Manifesto Updated',
      description: 'Your candidate manifesto has been updated successfully'
    });
  };

  if (!myCandidate) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                You haven't applied as a candidate yet
              </p>
              <Button className="mt-4">Apply as Candidate</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
          <p className="text-muted-foreground">
            Manage your candidacy profile and campaign information
          </p>
        </div>

        {/* Status Card */}
        <Card className={myCandidate.isApproved ? 'border-green-500/50 bg-green-500/5' : 'border-orange-500/50 bg-orange-500/5'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  myCandidate.isApproved ? 'bg-green-500/20' : 'bg-orange-500/20'
                }`}>
                  <UserCircle className={`w-6 h-6 ${
                    myCandidate.isApproved ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold">
                    Status: {myCandidate.isApproved ? 'Approved' : 'Pending Approval'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {myCandidate.isApproved 
                      ? 'You can now edit your profile and participate in elections' 
                      : 'Your application is being reviewed by administrators'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-primary">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-2xl font-bold">{myCandidate.totalVote}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Votes</p>
                </div>
                {myCandidate.isWinner && (
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
                    <p className="text-xs text-muted-foreground mt-1">Winner</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>
              How voters will see your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden mb-4">
              {myCandidate.imageUrl ? (
                <img
                  src={myCandidate.imageUrl}
                  alt={myCandidate.candidateName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                    {myCandidate.candidateName.charAt(0)}
                  </div>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-1">{myCandidate.candidateName}</h3>
            <p className="text-muted-foreground mb-2">{myCandidate.postEnum}</p>
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">{myCandidate.course}</Badge>
              <Badge variant="outline">Section {myCandidate.section}</Badge>
              <Badge variant="outline">{myCandidate.session}</Badge>
            </div>
            <p className="text-sm">{manifesto}</p>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Manifesto</CardTitle>
            <CardDescription>
              {myCandidate.isApproved
                ? 'Update your campaign manifesto'
                : 'Manifesto editing will be enabled after approval'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Candidate Name (Read-only)</Label>
                <p className="text-base font-semibold">{myCandidate.candidateName}</p>
              </div>

              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Student ID (Read-only)</Label>
                <p className="text-base font-mono">{myCandidate.studentId}</p>
              </div>

              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Post (Read-only)</Label>
                <p className="text-base">{myCandidate.postEnum}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manifesto">Manifesto *</Label>
              <Textarea
                id="manifesto"
                placeholder="Your campaign manifesto..."
                value={manifesto}
                onChange={(e) => setManifesto(e.target.value)}
                className="min-h-[200px]"
                disabled={!myCandidate.isApproved}
              />
              <p className="text-xs text-muted-foreground">
                Share your vision and goals with the voters
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={!myCandidate.isApproved}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Manifesto
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfile;
