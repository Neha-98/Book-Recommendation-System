import React from 'react';
import { Recommendation } from '../types';
import { Star, Target } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Target className="w-5 h-5 text-indigo-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Recommended Books</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={rec.book.id} className="border border-gray-200 rounded-md p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <img
                src={rec.book.cover}
                alt={rec.book.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {rec.book.title}
                </h3>
                <p className="text-xs text-gray-600 mb-1">{rec.book.author}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {rec.book.genre}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {renderStars(rec.predictedRating)}
                  <span className="text-sm font-medium text-gray-700">
                    {rec.predictedRating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Prediction Confidence:</span>
                <div className={`text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                  {(rec.confidence * 100).toFixed(0)}% - {getConfidenceLabel(rec.confidence)}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                {rec.book.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};