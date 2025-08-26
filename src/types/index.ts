export interface User {
  id: number;
  name: string;
  ratings: { [bookId: number]: number };
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  description: string;
  publishedYear: number;
}

export interface Recommendation {
  book: Book;
  predictedRating: number;
  confidence: number;
}

export interface UserSimilarity {
  userId: number;
  similarity: number;
}

export interface SystemStats {
  totalUsers: number;
  totalBooks: number;
  totalRatings: number;
  sparsity: number;
  averageRating: number;
}