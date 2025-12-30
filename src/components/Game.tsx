import { useState, useEffect, useCallback } from 'react';
import Ballpit from './Ballpit';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';

interface GameProps {
    projectId: string;
}

export const Game = ({ projectId }: GameProps) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Load score from localStorage
        const stored = localStorage.getItem(`game-score-${projectId}`);
        if (stored) {
            setScore(parseInt(stored, 10) || 0);
        }
    }, [projectId]);

    const handleScore = useCallback(() => {
        setScore(prev => {
            const newScore = prev + 1;
            localStorage.setItem(`game-score-${projectId}`, newScore.toString());
            return newScore;
        });
    }, [projectId]);

    const handleReset = useCallback(() => {
        setScore(0);
        localStorage.removeItem(`game-score-${projectId}`);
    }, [projectId]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="text-lg font-semibold">Score: {score}</div>
                <Button onClick={handleReset} variant="outline" size="sm">
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                </Button>
            </div>
            <div className="flex-1">
                <Ballpit onScore={handleScore} />
            </div>
        </div>
    );
};
