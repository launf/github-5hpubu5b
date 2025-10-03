import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserCheck, FileText } from 'lucide-react';
import { toBackendSession } from '@/lib/sessionUtils';

// PostEnum values as per backend specification
const POST_OPTIONS = [
  { value: 'CR', label: 'Class Representative (CR)' },
  { value: 'DC', label: 'Disciplinary Committee (DC)' }
];

const ApplyCandidate = () => {
  const { applyForCandidate, getStudentById } = useData();
  const { user } = useAuth();
  
  const student = user?.studentId ? getStudentById(user.studentId) : undefined;
  const hasApplied = student?.appliedForCandidate;

  const [formData, setFormData] = useState({
    postEnum: '',
    manifesto: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.postEnum || !formData.manifesto) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive'
      });
      return;
    }

    if (!user?.studentId || !user?.name || !user?.department) {
      toast({
        title: 'Error',
        description: 'User information not found',
        variant: 'destructive'
      });
      return;
    }

    applyForCandidate({
      studentId: user.studentId,
      candidateName: user.name,
      manifesto: formData.manifesto,
      postEnum: formData.postEnum,
      session: toBackendSession(user.session || '2024-25'),
      course: user.department,
      section: 'A' // Would come from user data in real app
    });

    toast({
      title: 'Application Submitted',
      description: 'Your candidacy application has been submitted for review'
    });

    setFormData({ postEnum: '', manifesto: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Apply for Candidacy</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Submit your application to run in student elections
          </p>
        </div>

        {hasApplied && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-700">
                <UserCheck className="w-5 h-5" />
                <p className="font-medium">You have already applied for a post.</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Students can only apply for one position. Your application is currently being reviewed.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Form
            </CardTitle>
            <CardDescription>
              Fill out the form below to apply as a candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Candidate Name</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={user?.studentId || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={user?.department || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post">Position *</Label>
                <Select
                  value={formData.postEnum}
                  onValueChange={(value) => setFormData({ ...formData, postEnum: value })}
                  disabled={hasApplied}
                >
                  <SelectTrigger id="post">
                    <SelectValue placeholder="Select position to run for" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_OPTIONS.map((post) => (
                      <SelectItem key={post.value} value={post.value}>
                        {post.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose from available positions only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manifesto">Manifesto *</Label>
                <Textarea
                  id="manifesto"
                  placeholder="Describe your vision, goals, and why students should vote for you..."
                  value={formData.manifesto}
                  onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                  className="min-h-[150px]"
                  disabled={hasApplied}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 50 characters
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={hasApplied}
              >
                {hasApplied ? 'Application Already Submitted' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApplyCandidate;
