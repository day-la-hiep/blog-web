export interface Post {
   id: string;
   title: string;
   summary: string;
   content: string;
   authorName: string;
   authorAvatar?: string;
   createdAt: string;
   thumbNailUrl?: string;
   categories: string[];
   status: string;
} 