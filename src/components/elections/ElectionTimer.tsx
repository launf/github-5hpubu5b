import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { MOCK_DURATION_MIN } from '@/contexts/DataContext';

interface ElectionTimerProps {
  startTime: Date;
  onTimeEnd: () => void;
}

export const ElectionTimer = ({ startTime, onTimeEnd }: ElectionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const duration = MOCK_DURATION_MIN * 60 * 1000;
      const end = start + duration;
      const remaining = Math.max(0, end - now);
      
      if (remaining === 0) {
        onTimeEnd();
      }
      
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, onTimeEnd]);

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Clock className="w-4 h-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
