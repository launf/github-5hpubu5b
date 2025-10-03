import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Elections from "./pages/admin/Elections";
import Candidates from "./pages/admin/Candidates";
import AdminVotes from "./pages/admin/Votes";
import AdminWinners from "./pages/admin/Winners";
import StudentDashboard from "./pages/student/StudentDashboard";
import ElectionStatus from "./pages/student/ElectionStatus";
import ApplyCandidate from "./pages/student/ApplyCandidate";
import ViewCandidates from "./pages/student/ViewCandidates";
import Vote from "./pages/student/Vote";
import MyVotes from "./pages/student/MyVotes";
import Winners from "./pages/student/Winners";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import StudentProfile from "./pages/student/StudentProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const IndexRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IndexRedirect />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/elections"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Elections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/candidates"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Candidates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/votes"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminVotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/winners"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminWinners />
                  </ProtectedRoute>
                }
              />
              
              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/elections"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <ElectionStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/apply"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <ApplyCandidate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/candidates"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <ViewCandidates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/vote"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Vote />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/my-votes"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MyVotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/winners"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Winners />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/profile"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <CandidateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
