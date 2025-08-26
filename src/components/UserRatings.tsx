import React from 'react';
import { User, Book } from '../types';
import { Star, BookOpen } from 'lucide-react';

interface UserRatingsProps {
  user: User;
  books: Book[];
}

export const UserRatings: React.FC<UserRatingsProps> = ({ user, books }) => {
  const ratedBooks = books.filter(book => user.ratings[book.id] !== undefined);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <BookOpen className="w-5 h-5 text-green-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">
          {user.name}'s Book Ratings
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ratedBooks.map(book => (
          <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
            <img
              src={book.cover}
              alt={book.title}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm">{book.title}</h3>
              <p className="text-xs text-gray-600">{book.author}</p>
              <div className="flex items-center mt-1">
                {renderStars(user.ratings[book.id])}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user.ratings[book.id]}/5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};