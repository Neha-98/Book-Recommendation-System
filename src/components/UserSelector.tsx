import React from 'react';
import { User } from '../types';
import { Users } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedUserId: number | null;
  onUserSelect: (userId: number) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onUserSelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Select User</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`p-3 rounded-md border transition-colors text-sm font-medium ${
              selectedUserId === user.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {user.name}
            <div className="text-xs text-gray-500 mt-1">
              {Object.keys(user.ratings).length} ratings
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};