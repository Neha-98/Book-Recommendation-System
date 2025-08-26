import React from 'react';
import { UserSimilarity, User } from '../types';
import { Users, TrendingUp } from 'lucide-react';

interface SimilarUsersProps {
  similarities: UserSimilarity[];
  users: User[];
}

export const SimilarUsers: React.FC<SimilarUsersProps> = ({ similarities, users }) => {
  const getSimilarityColor = (similarity: number) => {
    const absValue = Math.abs(similarity);
    if (absValue >= 0.7) return 'text-green-600';
    if (absValue >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSimilarityLabel = (similarity: number) => {
    const absValue = Math.abs(similarity);
    if (absValue >= 0.7) return 'High Similarity';
    if (absValue >= 0.4) return 'Medium Similarity';
    return 'Low Similarity';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">k-Nearest Neighbors (k=5)</h2>
      </div>
      
      <div className="space-y-3">
        {similarities.map((sim, index) => {
          const user = users.find(u => u.id === sim.userId);
          if (!user) return null;

          return (
            <div key={sim.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    {Object.keys(user.ratings).length} books rated
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-semibold ${getSimilarityColor(sim.similarity)}`}>
                  {sim.similarity.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500">
                  {getSimilarityLabel(sim.similarity)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};