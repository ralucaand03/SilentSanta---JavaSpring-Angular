export interface Letters {
    id: string;
    title: string;
    wishList: string[];
    childName: string;
    status: string;
    createdAt: string;
    gender?: string;
    location?: string;
    childAge?: number;
    imagePath?: string;
    isFavorite?: boolean;
    isRequested?: boolean;
    showImage?: boolean;
    postedBy?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
  