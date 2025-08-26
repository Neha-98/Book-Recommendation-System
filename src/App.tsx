import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Target } from 'lucide-react';
import { CollaborativeFilteringEngine } from './algorithms/collaborativeFiltering';
import { UserSelector } from './components/UserSelector';
import { UserRatings } from './components/UserRatings';
import { SimilarUsers } from './components/SimilarUsers';
import { Recommendations } from './components/Recommendations';
import { SystemMetrics } from './components/SystemMetrics';
import { users } from './data/users';
import { books } from './data/books';
import { UserSimilarity, Recommendation } from './types';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [similarities, setSimilarities] = useState<UserSimilarity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [systemAccuracy, setSystemAccuracy] = useState<number>(0);
  const [totalPredictions, setTotalPredictions] = useState<number>(0);
  const [engine] = useState(() => new CollaborativeFilteringEngine(users, books));

  useEffect(() => {
    // Calculate system accuracy on mount
    const { accuracy, totalPredictions: total } = engine.calculateAccuracy();
    setSystemAccuracy(accuracy);
    setTotalPredictions(total);
  }, [engine]);

  useEffect(() => {
    if (selectedUserId) {
      // Find similar users using k-NN algorithm
      const nearestNeighbors = engine.findNearestNeighbors(selectedUserId, 5);
      setSimilarities(nearestNeighbors);

      // Generate recommendations based on collaborative filtering
      const userRecommendations = engine.generateRecommendations(selectedUserId, 5, 6);
      setRecommendations(userRecommendations);
    }
  }, [selectedUserId, engine]);

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calculator className="w-8 h-8 text-blue-600" />
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Collaborative Filtering Recommendation System
              </h1>
              <p className="text-gray-600 mt-1">
                k-Nearest Neighbors Algorithm for Book Recommendations (2020)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Performance Metrics */}
        <SystemMetrics
          accuracy={systemAccuracy}
          totalPredictions={totalPredictions}
          totalUsers={users.length}
          totalBooks={books.length}
        />

        {/* User Selection */}
        <UserSelector
          users={users}
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
        />

        {selectedUser && (
          <>
            {/* User Ratings Display */}
            <UserRatings user={selectedUser} books={books} />

            {/* Similar Users (k-NN Results) */}
            {similarities.length > 0 && (
              <SimilarUsers similarities={similarities} users={users} />
            )}

            {/* Collaborative Filtering Recommendations */}
            {recommendations.length > 0 && (
              <Recommendations recommendations={recommendations} />
            )}
          </>
        )}

        {!selectedUser && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Target className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Machine Learning-Based Book Recommendation System
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              This system demonstrates collaborative filtering using the k-Nearest Neighbors algorithm 
              to provide personalized book recommendations. Built using traditional machine learning 
              techniques popular in 2020, before the widespread adoption of deep learning approaches.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-md">
                <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">k-NN Algorithm</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Uses Pearson correlation for user similarity calculation
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Rating Dataset</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Real user ratings on popular books from 2020 and earlier
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-md">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Predictive Model</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Weighted averaging for rating prediction and recommendation
                </p>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Select a user above to see their ratings and get personalized recommendations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;