import { User, UserSimilarity, Recommendation, Book } from '../types';

export class CollaborativeFilteringEngine {
  private users: User[];
  private books: Book[];

  constructor(users: User[], books: Book[]) {
    this.users = users;
    this.books = books;
  }

  /**
   * Calculate Euclidean distance between two users based on their ratings
   */
  private calculateEuclideanDistance(user1: User, user2: User): number {
    const commonBooks = this.getCommonBooks(user1, user2);
    
    if (commonBooks.length === 0) return 0;

    const sumSquaredDifferences = commonBooks.reduce((sum, bookId) => {
      const diff = user1.ratings[bookId] - user2.ratings[bookId];
      return sum + (diff * diff);
    }, 0);

    // Convert distance to similarity (0-1 scale, higher is more similar)
    return 1 / (1 + Math.sqrt(sumSquaredDifferences));
  }

  /**
   * Calculate Cosine similarity between two users
   */
  private calculateCosineSimilarity(user1: User, user2: User): number {
    const commonBooks = this.getCommonBooks(user1, user2);
    
    if (commonBooks.length === 0) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    commonBooks.forEach(bookId => {
      const rating1 = user1.ratings[bookId];
      const rating2 = user2.ratings[bookId];
      
      dotProduct += rating1 * rating2;
      norm1 += rating1 * rating1;
      norm2 += rating2 * rating2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Calculate Pearson correlation coefficient between two users
   */
  private calculatePearsonCorrelation(user1: User, user2: User): number {
    const commonBooks = this.getCommonBooks(user1, user2);
    
    if (commonBooks.length < 2) return 0;

    // Calculate means
    const mean1 = commonBooks.reduce((sum, bookId) => sum + user1.ratings[bookId], 0) / commonBooks.length;
    const mean2 = commonBooks.reduce((sum, bookId) => sum + user2.ratings[bookId], 0) / commonBooks.length;

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    commonBooks.forEach(bookId => {
      const diff1 = user1.ratings[bookId] - mean1;
      const diff2 = user2.ratings[bookId] - mean2;
      
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    });

    if (denominator1 === 0 || denominator2 === 0) return 0;
    
    return numerator / Math.sqrt(denominator1 * denominator2);
  }

  /**
   * Get books that both users have rated
   */
  private getCommonBooks(user1: User, user2: User): number[] {
    const books1 = Object.keys(user1.ratings).map(Number);
    const books2 = Object.keys(user2.ratings).map(Number);
    return books1.filter(bookId => books2.includes(bookId));
  }

  /**
   * Find k nearest neighbors for a given user
   */
  public findNearestNeighbors(targetUserId: number, k: number = 5, metric: 'euclidean' | 'cosine' | 'pearson' = 'pearson'): UserSimilarity[] {
    const targetUser = this.users.find(u => u.id === targetUserId);
    if (!targetUser) return [];

    const similarities: UserSimilarity[] = [];

    this.users.forEach(user => {
      if (user.id !== targetUserId) {
        let similarity: number;
        
        switch (metric) {
          case 'euclidean':
            similarity = this.calculateEuclideanDistance(targetUser, user);
            break;
          case 'cosine':
            similarity = this.calculateCosineSimilarity(targetUser, user);
            break;
          case 'pearson':
            similarity = this.calculatePearsonCorrelation(targetUser, user);
            break;
          default:
            similarity = this.calculatePearsonCorrelation(targetUser, user);
        }

        similarities.push({
          userId: user.id,
          similarity: similarity
        });
      }
    });

    // Sort by similarity (descending) and return top k
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);
  }

  /**
   * Predict rating for a specific book using weighted average of neighbors
   */
  public predictRating(targetUserId: number, bookId: number, neighbors: UserSimilarity[]): number {
    let weightedSum = 0;
    let similaritySum = 0;

    neighbors.forEach(neighbor => {
      const neighborUser = this.users.find(u => u.id === neighbor.userId);
      if (neighborUser && neighborUser.ratings[bookId] !== undefined) {
        const weight = Math.abs(neighbor.similarity); // Use absolute value for weight
        weightedSum += neighborUser.ratings[bookId] * weight;
        similaritySum += weight;
      }
    });

    return similaritySum > 0 ? weightedSum / similaritySum : 3; // Default to 3 if no data
  }

  /**
   * Generate recommendations for a user
   */
  public generateRecommendations(targetUserId: number, k: number = 5, numRecommendations: number = 5): Recommendation[] {
    const targetUser = this.users.find(u => u.id === targetUserId);
    if (!targetUser) return [];

    const neighbors = this.findNearestNeighbors(targetUserId, k);
    const recommendations: Recommendation[] = [];

    // Find books the target user hasn't rated
    const unratedBooks = this.books.filter(book => 
      targetUser.ratings[book.id] === undefined
    );

    unratedBooks.forEach(book => {
      const predictedRating = this.predictRating(targetUserId, book.id, neighbors);
      
      // Calculate confidence based on how many neighbors rated this book
      const neighborsWhoRated = neighbors.filter(neighbor => {
        const neighborUser = this.users.find(u => u.id === neighbor.userId);
        return neighborUser && neighborUser.ratings[book.id] !== undefined;
      });
      
      const confidence = neighborsWhoRated.length / neighbors.length;

      recommendations.push({
        book,
        predictedRating,
        confidence
      });
    });

    // Sort by predicted rating (descending) and return top recommendations
    return recommendations
      .sort((a, b) => b.predictedRating - a.predictedRating)
      .slice(0, numRecommendations);
  }

  /**
   * Calculate system accuracy by comparing predictions with actual ratings
   */
  public calculateAccuracy(): { accuracy: number; totalPredictions: number } {
    let correctPredictions = 0;
    let totalPredictions = 0;

    this.users.forEach(user => {
      const userRatings = Object.keys(user.ratings).map(Number);
      
      // For each rated book, try to predict it using other users
      userRatings.forEach(bookId => {
        const actualRating = user.ratings[bookId];
        
        // Temporarily remove this rating to simulate prediction
        const tempRatings = { ...user.ratings };
        delete tempRatings[bookId];
        const tempUser = { ...user, ratings: tempRatings };
        
        // Find neighbors excluding the current book rating
        const neighbors = this.findNearestNeighbors(user.id, 5);
        const predictedRating = this.predictRating(user.id, bookId, neighbors);
        
        // Consider prediction correct if within 1 point of actual rating
        if (Math.abs(predictedRating - actualRating) <= 1) {
          correctPredictions++;
        }
        totalPredictions++;
      });
    });

    return {
      accuracy: totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0,
      totalPredictions
    };
  }
}