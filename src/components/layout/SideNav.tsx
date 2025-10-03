import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Vote, 
  FileText, 
  BarChart3,
  UserCheck,
  Trophy,
  CheckCircle,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideNavProps {
  mobile?: boolean;
}

const SideNav = ({ mobile = false }: SideNavProps) => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/elections', icon: Vote, label: 'Elections' },
    { to: '/admin/candidates', icon: UserCheck, label: 'Candidates' },
    { to: '/admin/votes', icon: BarChart3, label: 'Votes' },
    { to: '/admin/winners', icon: Trophy, label: 'Winners' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: UserCircle, label: 'My Profile' },
    { to: '/student/elections', icon: Vote, label: 'Election Status' },
    { to: '/student/candidates', icon: UserCheck, label: 'View Candidates' },
    { to: '/student/vote', icon: Vote, label: 'Cast Vote' },
    { to: '/student/my-votes', icon: CheckCircle, label: 'My Votes' },
    { to: '/student/apply', icon: FileText, label: 'Apply as Candidate' },
    { to: '/candidate/profile', icon: Users, label: 'Candidate Profile' },
    { to: '/student/winners', icon: Trophy, label: 'Winners' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;
  const accentColor = user?.role === 'ADMIN' 
    ? 'hover:bg-[hsl(271,81%,56%,0.1)] data-[active=true]:bg-[hsl(271,81%,56%,0.15)] data-[active=true]:text-[hsl(271,81%,56%)]' 
    : 'hover:bg-[hsl(199,89%,48%,0.1)] data-[active=true]:bg-[hsl(199,89%,48%,0.15)] data-[active=true]:text-[hsl(199,89%,48%)]';

  if (mobile) {
    return (
      <nav className="flex flex-col gap-1 p-4 pt-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                accentColor,
                isActive && 'font-semibold'
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    user?.role === 'ADMIN' 
                      ? 'bg-[hsl(271,81%,56%)]' 
                      : 'bg-[hsl(199,89%,48%)]'
                  }`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <aside className="hidden md:block w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                accentColor,
                isActive && 'font-semibold'
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    user?.role === 'ADMIN' 
                      ? 'bg-[hsl(271,81%,56%)]' 
                      : 'bg-[hsl(199,89%,48%)]'
                  }`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideNav;
