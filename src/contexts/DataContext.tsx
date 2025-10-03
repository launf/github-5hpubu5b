import { createContext, useContext, useState, ReactNode } from 'react';

export interface AdminEntity {
  id: string;
  adminName: string;
  adminEmail: string;
  password: string;
  role: 'ADMIN';
  createdAt: Date;
}

export interface StudentEntity {
  id: string;
  studentName: string;
  studentID: string;
  studentEmail: string;
  password: string;
  role: 'STUDENT';
  session: string;
  section: string;
  course: string;
  createdAt: Date;
  appliedForCandidate?: boolean;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface CandidateEntity {
  id: string;
  candidateName: string;
  manifesto: string;
  isApproved: boolean;
  studentId: string;
  createdAt: Date;
  totalVote: number;
  postEnum: string;
  isWinner: boolean;
  imageUrl?: string;
  session: string;
  course: string;
  section: string;
}

export interface ElectionEntity {
  id: string;
  session: string;
  course: string;
  post: string;
  createdAt: Date;
  startTime: Date | null;
  isLive: boolean;
  createdBy: string;
}

export interface VoteEntity {
  id: string;
  voterId: string;
  candidateId: string;
  votedAt: Date;
  votedForPost: string;
  session: string;
  course: string;
  section: string;
}

export interface WinnerEntity {
  id: string;
  studentName: string;
  studentId: string;
  section: string;
  candidateId: string;
  session: string;
  course: string;
  post: string;
  createdAt: Date;
}

export const MOCK_DURATION_MIN = 30;

interface DataContextType {
  admins: AdminEntity[];
  students: StudentEntity[];
  elections: ElectionEntity[];
  candidates: CandidateEntity[];
  votes: VoteEntity[];
  winners: WinnerEntity[];
  createAdmin: (data: Omit<AdminEntity, 'id' | 'role' | 'createdAt'>) => void;
  createStudent: (data: Omit<StudentEntity, 'id' | 'role' | 'createdAt'>) => void;
  deleteStudent: (studentID: string) => void;
  updateStudentProfile: (studentID: string, data: Partial<Pick<StudentEntity, 'studentName' | 'studentEmail' | 'course' | 'section' | 'session' | 'imageUrl' | 'imagePublicId'>>) => void;
  changeStudentPassword: (studentID: string, oldPassword: string, newPassword: string) => boolean;
  createElection: (data: Omit<ElectionEntity, 'id' | 'createdAt' | 'startTime' | 'isLive'>) => void;
  startElection: (id: string) => void;
  endElection: (id: string) => void;
  deleteElection: (id: string) => void;
  resetElections: (filters: { session?: string; course?: string; post?: string; section?: string }) => void;
  applyForCandidate: (data: { studentId: string; candidateName: string; manifesto: string; postEnum: string; session: string; course: string; section: string }) => void;
  toggleCandidateApproval: (id: string) => void;
  updateCandidateProfile: (id: string, data: { manifesto?: string; imageUrl?: string }) => void;
  getStudentById: (id: string) => StudentEntity | undefined;
  getCandidateById: (id: string) => CandidateEntity | undefined;
  castVote: (voterId: string, candidateId: string, post: string, session: string, course: string, section: string) => boolean;
  hasVotedForPost: (voterId: string, post: string) => boolean;
  saveWinner: (candidateId: string) => void;
  removeWinner: (winnerId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_ADMINS: AdminEntity[] = [
  {
    id: 'admin_001',
    adminName: 'Super Admin',
    adminEmail: 'admin@university.edu',
    password: 'password123',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01')
  }
];

const MOCK_STUDENTS: StudentEntity[] = [
  {
    id: 'student_001',
    studentName: 'John Doe',
    studentID: 'BCA2024_001',
    studentEmail: 'john.doe@student.edu',
    password: 'pass1234',
    role: 'STUDENT',
    session: '2024-2025',
    section: 'A',
    course: 'BCA',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'student_002',
    studentName: 'Jane Smith',
    studentID: 'BCA2024_002',
    studentEmail: 'jane.smith@student.edu',
    password: 'pass5678',
    role: 'STUDENT',
    session: '2024-2025',
    section: 'B',
    course: 'BCA',
    createdAt: new Date('2024-01-16')
  }
];

const MOCK_ELECTIONS: ElectionEntity[] = [
  {
    id: 'election_001',
    session: '2024-2025',
    course: 'BCA',
    post: 'Class Representative',
    createdAt: new Date('2024-01-20'),
    startTime: null,
    isLive: false,
    createdBy: 'admin_001'
  }
];

const MOCK_CANDIDATES: CandidateEntity[] = [
  {
    id: 'candidate_001',
    candidateName: 'John Doe',
    manifesto: 'I will work hard to represent our class and ensure everyone\'s voice is heard.',
    isApproved: true,
    studentId: 'BCA2024_001',
    createdAt: new Date('2024-01-21'),
    totalVote: 45,
    postEnum: 'Class Representative',
    isWinner: false,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    session: '2024-2025',
    course: 'BCA',
    section: 'A'
  },
  {
    id: 'candidate_002',
    candidateName: 'Jane Smith',
    manifesto: 'Together we can build a better student community with inclusive policies.',
    isApproved: true,
    studentId: 'BCA2024_002',
    createdAt: new Date('2024-01-22'),
    totalVote: 38,
    postEnum: 'Class Representative',
    isWinner: false,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    session: '2024-2025',
    course: 'BCA',
    section: 'B'
  }
];

const MOCK_VOTES: VoteEntity[] = [];

const MOCK_WINNERS: WinnerEntity[] = [];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [admins, setAdmins] = useState<AdminEntity[]>(MOCK_ADMINS);
  const [students, setStudents] = useState<StudentEntity[]>(MOCK_STUDENTS);
  const [elections, setElections] = useState<ElectionEntity[]>(MOCK_ELECTIONS);
  const [candidates, setCandidates] = useState<CandidateEntity[]>(MOCK_CANDIDATES);
  const [votes, setVotes] = useState<VoteEntity[]>(MOCK_VOTES);
  const [winners, setWinners] = useState<WinnerEntity[]>(MOCK_WINNERS);

  const createAdmin = (data: Omit<AdminEntity, 'id' | 'role' | 'createdAt'>) => {
    const newAdmin: AdminEntity = {
      ...data,
      id: `admin_${Date.now()}`,
      role: 'ADMIN',
      createdAt: new Date()
    };
    setAdmins([...admins, newAdmin]);
  };

  const createStudent = (data: Omit<StudentEntity, 'id' | 'role' | 'createdAt'>) => {
    const newStudent: StudentEntity = {
      ...data,
      id: `student_${Date.now()}`,
      role: 'STUDENT',
      createdAt: new Date()
    };
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (studentID: string) => {
    setStudents(students.filter(s => s.studentID !== studentID));
  };

  const updateStudentProfile = (studentID: string, data: Partial<Pick<StudentEntity, 'studentName' | 'studentEmail' | 'course' | 'section' | 'session' | 'imageUrl' | 'imagePublicId'>>) => {
    setStudents(students.map(student =>
      student.studentID === studentID
        ? { ...student, ...data }
        : student
    ));
  };

  const changeStudentPassword = (studentID: string, oldPassword: string, newPassword: string): boolean => {
    const student = students.find(s => s.studentID === studentID);
    
    if (!student || student.password !== oldPassword) {
      return false;
    }

    setStudents(students.map(s =>
      s.studentID === studentID
        ? { ...s, password: newPassword }
        : s
    ));

    return true;
  };

  const createElection = (data: Omit<ElectionEntity, 'id' | 'createdAt' | 'startTime' | 'isLive'>) => {
    const newElection: ElectionEntity = {
      ...data,
      id: `election_${Date.now()}`,
      createdAt: new Date(),
      startTime: null,
      isLive: false
    };
    setElections([...elections, newElection]);
  };

  const startElection = (id: string) => {
    setElections(elections.map(election =>
      election.id === id
        ? { ...election, isLive: true, startTime: new Date() }
        : election
    ));
  };

  const endElection = (id: string) => {
    setElections(elections.map(election =>
      election.id === id
        ? { ...election, isLive: false }
        : election
    ));
  };

  const deleteElection = (id: string) => {
    setElections(elections.filter(e => e.id !== id));
  };

  const resetElections = (filters: { session?: string; course?: string; post?: string; section?: string }) => {
    setElections(elections.filter(election => {
      if (filters.session && election.session !== filters.session) return true;
      if (filters.course && election.course !== filters.course) return true;
      if (filters.post && election.post !== filters.post) return true;
      return false;
    }));
  };

  const applyForCandidate = (data: { studentId: string; candidateName: string; manifesto: string; postEnum: string; session: string; course: string; section: string }) => {
    const newCandidate: CandidateEntity = {
      id: `candidate_${Date.now()}`,
      candidateName: data.candidateName,
      manifesto: data.manifesto,
      isApproved: false,
      studentId: data.studentId,
      createdAt: new Date(),
      totalVote: 0,
      postEnum: data.postEnum,
      isWinner: false,
      session: data.session,
      course: data.course,
      section: data.section
    };
    setCandidates([...candidates, newCandidate]);
    
    // Update student's appliedForCandidate status
    setStudents(students.map(student =>
      student.studentID === data.studentId
        ? { ...student, appliedForCandidate: true }
        : student
    ));
  };

  const toggleCandidateApproval = (id: string) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id
        ? { ...candidate, isApproved: !candidate.isApproved }
        : candidate
    ));
  };

  const updateCandidateProfile = (id: string, data: { manifesto?: string; imageUrl?: string }) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id
        ? { ...candidate, ...data }
        : candidate
    ));
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.studentID === id);
  };

  const getCandidateById = (id: string) => {
    return candidates.find(c => c.id === id);
  };

  const hasVotedForPost = (voterId: string, post: string) => {
    return votes.some(v => v.voterId === voterId && v.votedForPost === post);
  };

  const castVote = (voterId: string, candidateId: string, post: string, session: string, course: string, section: string) => {
    // Check if already voted for this post
    if (hasVotedForPost(voterId, post)) {
      return false;
    }

    // Create vote
    const newVote: VoteEntity = {
      id: `vote_${Date.now()}`,
      voterId,
      candidateId,
      votedAt: new Date(),
      votedForPost: post,
      session,
      course,
      section
    };
    setVotes([...votes, newVote]);

    // Update candidate's total votes
    setCandidates(candidates.map(c =>
      c.id === candidateId ? { ...c, totalVote: c.totalVote + 1 } : c
    ));

    return true;
  };

  const saveWinner = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const newWinner: WinnerEntity = {
      id: `winner_${Date.now()}`,
      studentName: candidate.candidateName,
      studentId: candidate.studentId,
      section: candidate.section,
      candidateId: candidate.id,
      session: candidate.session,
      course: candidate.course,
      post: candidate.postEnum,
      createdAt: new Date()
    };
    setWinners([...winners, newWinner]);

    // Mark candidate as winner
    setCandidates(candidates.map(c =>
      c.id === candidateId ? { ...c, isWinner: true } : c
    ));
  };

  const removeWinner = (winnerId: string) => {
    const winner = winners.find(w => w.id === winnerId);
    if (winner) {
      // Unmark candidate as winner
      setCandidates(candidates.map(c =>
        c.id === winner.candidateId ? { ...c, isWinner: false } : c
      ));
    }
    setWinners(winners.filter(w => w.id !== winnerId));
  };

  return (
    <DataContext.Provider value={{
      admins,
      students,
      elections,
      candidates,
      votes,
      winners,
      createAdmin,
      createStudent,
      deleteStudent,
      updateStudentProfile,
      changeStudentPassword,
      createElection,
      startElection,
      endElection,
      deleteElection,
      resetElections,
      applyForCandidate,
      toggleCandidateApproval,
      updateCandidateProfile,
      getStudentById,
      getCandidateById,
      castVote,
      hasVotedForPost,
      saveWinner,
      removeWinner
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
