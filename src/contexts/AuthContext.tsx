import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  role: 'ADMIN' | 'STUDENT';
  id: string;
  name: string;
  email?: string;
  studentId?: string;
  department?: string;
  session?: string;
  section?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any, role: 'ADMIN' | 'STUDENT') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const MOCK_ADMIN = {
  adminName: 'superadmin',
  password: 'password123',
  profile: {
    role: 'ADMIN' as const,
    id: 'admin_001',
    name: 'Super Admin',
    email: 'admin@university.edu'
  }
};

const MOCK_STUDENT = {
  studentId: 'BCA2024_001',
  password: 'pass1234',
  profile: {
    role: 'STUDENT' as const,
    id: 'BCA2024_001',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    studentId: 'BCA2024_001',
    department: 'BCA',
    session: '2024-2025',
    section: 'A'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any, role: 'ADMIN' | 'STUDENT'): Promise<boolean> => {
    try {
      // Mock API validation
      if (role === 'ADMIN') {
        if (credentials.adminName === MOCK_ADMIN.adminName && 
            credentials.password === MOCK_ADMIN.password) {
          setUser(MOCK_ADMIN.profile);
          localStorage.setItem('user', JSON.stringify(MOCK_ADMIN.profile));
          return true;
        }
      } else if (role === 'STUDENT') {
        if (credentials.studentId === MOCK_STUDENT.studentId && 
            credentials.password === MOCK_STUDENT.password) {
          setUser(MOCK_STUDENT.profile);
          localStorage.setItem('user', JSON.stringify(MOCK_STUDENT.profile));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
