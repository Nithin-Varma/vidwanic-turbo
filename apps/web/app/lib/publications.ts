export interface Publication {
  id: string;
  title: string;
  description: string | null;
  shortDesc: string | null;
  coverImage: string | null;
  price: number;
  suitableFor: string | null;
  totalPurchases: number;
  schoolPurchases: number;
  createdAt: string;
  updatedAt: string;
  commentsCount?: number;
  purchasesCount?: number;
}

export interface PublicationWithComments extends Publication {
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  _count: {
    comments: number;
    purchases: number;
  };
}

export async function fetchPublications(limit?: number, offset?: number): Promise<Publication[]> {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await fetch(`/api/publications?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export async function fetchPublication(id: string): Promise<PublicationWithComments | null> {
  try {
    const response = await fetch(`/api/publications/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch publication');
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching publication:', error);
    return null;
  }
}