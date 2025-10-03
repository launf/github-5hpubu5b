import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SideNav from './SideNav';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = user?.role === 'ADMIN' 
    ? 'bg-gradient-to-r from-[hsl(271,81%,56%)] to-[hsl(271,81%,66%)]' 
    : 'bg-gradient-to-r from-[hsl(199,89%,48%)] to-[hsl(199,89%,58%)]';

  return (
    <header className="sticky top-0 z-40 border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SideNav mobile />
              </SheetContent>
            </Sheet>
          )}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${roleColor} flex items-center justify-center text-white font-bold text-base sm:text-lg`}>
            {user?.role === 'ADMIN' ? 'A' : 'S'}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-semibold">Student Election System</h1>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'ADMIN' ? 'Administrator Portal' : 'Student Portal'}
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-semibold">Election System</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.name}</span>
            <span className={`ml-1 px-2 py-0.5 text-xs font-medium rounded-full ${
              user?.role === 'ADMIN' 
                ? 'bg-[hsl(271,81%,56%)] text-white' 
                : 'bg-[hsl(199,89%,48%)] text-white'
            }`}>
              {user?.role}
            </span>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-1 sm:gap-2"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
