import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Vote, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ElectionTimer } from './ElectionTimer';
import { ElectionEntity } from '@/contexts/DataContext';

interface ElectionBannerProps {
  election: ElectionEntity;
  onTimeEnd: () => void;
  onDismiss: () => void;
}

export const ElectionBanner = ({ election, onTimeEnd, onDismiss }: ElectionBannerProps) => {
  if (!election.isLive || !election.startTime) return null;

  return (
    <Alert className="mb-4 border-primary/50 bg-primary/5">
      <Vote className="h-5 w-5 text-primary" />
      <div className="flex items-center justify-between flex-1">
        <div className="flex-1">
          <AlertTitle className="text-lg font-bold mb-1">
            Election Live: {election.post}
          </AlertTitle>
          <AlertDescription className="flex items-center gap-4">
            <span>{election.course} - {election.session}</span>
            <ElectionTimer startTime={election.startTime} onTimeEnd={onTimeEnd} />
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="ml-4"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
