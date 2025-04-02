// src/app/models/letter.model.ts
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
    items?: string[];
    isFavorite?: boolean;
    isRequested?: boolean;
    showImage?: boolean;
  }
  