import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { User, Mail, BookOpen, Calendar } from 'lucide-react';
import ImageUpload from '@/components/student/ImageUpload';
import ChangePasswordForm from '@/components/student/ChangePasswordForm';

const StudentProfile = () => {
  const { user } = useAuth();
  const { students, updateStudentProfile, changeStudentPassword } = useData();
  
  const student = students.find(s => s.studentID === user?.studentId);
  
  const [formData, setFormData] = useState({
    studentName: student?.studentName || '',
    studentEmail: student?.studentEmail || '',
    course: student?.course || '',
    section: student?.section || '',
    session: student?.session || ''
  });

  const handleImageUpload = (imageUrl: string, publicId: string) => {
    if (!student) return;
    
    updateStudentProfile(student.studentID, {
      imageUrl,
      imagePublicId: publicId
    });
  };

  const handlePasswordChange = (oldPassword: string, newPassword: string): boolean => {
    if (!student) return false;
    return changeStudentPassword(student.studentID, oldPassword, newPassword);
  };

  if (!student) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Student profile not found</p>
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
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <ImageUpload
              currentImageUrl={student.imageUrl}
              userName={student.studentName}
              onUploadComplete={handleImageUpload}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your personal and academic details (read-only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studentEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="course" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course
                  </Label>
                  <Input
                    id="course"
                    value={formData.course}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="session" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Session
                  </Label>
                  <Input
                    id="session"
                    value={formData.session}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Student ID</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm font-mono">
                    {student.studentID}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    (Cannot be changed)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <ChangePasswordForm onPasswordChange={handlePasswordChange} />

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created:</span>
                <span>{new Date(student.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <Badge>{student.role}</Badge>
              </div>
              {student.appliedForCandidate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidate Status:</span>
                  <Badge variant="secondary">Applied</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
