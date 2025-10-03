import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, ThumbsUp } from 'lucide-react';
import { CandidateEntity } from '@/contexts/DataContext';

interface CandidateCardProps {
  candidate: CandidateEntity;
  onClick?: () => void;
}

export const CandidateCard = ({ candidate, onClick }: CandidateCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
        {candidate.imageUrl ? (
          <img 
            src={candidate.imageUrl} 
            alt={candidate.candidateName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
              {candidate.candidateName.charAt(0)}
            </div>
          </div>
        )}
        {candidate.isWinner && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Trophy className="w-3 h-3 mr-1" />
              Winner
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg">{candidate.candidateName}</h3>
            <p className="text-sm text-muted-foreground">{candidate.postEnum}</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <ThumbsUp className="w-4 h-4" />
            <span className="font-semibold">{candidate.totalVote}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {candidate.manifesto}
        </p>
        <div className="mt-3 flex gap-2">
          <Badge variant="outline">{candidate.course}</Badge>
          <Badge variant="outline">Section {candidate.section}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
