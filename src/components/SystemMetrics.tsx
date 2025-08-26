import React from 'react';
import { BarChart3, Target, Users, BookOpen } from 'lucide-react';

interface SystemMetricsProps {
  accuracy: number;
  totalPredictions: number;
  totalUsers: number;
  totalBooks: number;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({
  accuracy,
  totalPredictions,
  totalUsers,
  totalBooks
}) => {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-green-600';
    if (acc >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyLabel = (acc: number) => {
    if (acc >= 80) return 'Excellent Performance';
    if (acc >= 70) return 'Good Performance';
    return 'Fair Performance';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">System Performance Metrics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-md">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className={`text-2xl font-bold mb-1 ${getAccuracyColor(accuracy)}`}>
            {accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Prediction Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">
            {getAccuracyLabel(accuracy)}
          </div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-md">
          <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600 mb-1">
            {totalPredictions}
          </div>
          <div className="text-sm text-gray-600">Total Predictions</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-md">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {totalUsers}
          </div>
          <div className="text-sm text-gray-600">Users in Dataset</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-md">
          <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {totalBooks}
          </div>
          <div className="text-sm text-gray-600">Books in Catalog</div>
        </div>
      </div>
    </div>
  );
};