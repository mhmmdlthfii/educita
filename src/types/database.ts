/**
 * Educita.id Database & Application Types
 */

export interface SchoolService {
  id: string;
  name: string;
  category: 'software' | 'hardware' | 'infrastructure' | 'consultation';
  description: string;
  details: string[];
  icon: string; // Lucide icon name
  priceRange?: string;
  popular?: boolean;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  category: string;
  schoolName: string;
  description: string;
  stats: string;
  imageUrl: string;
  completedYear: number;
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: 'systems' | 'hardware' | 'services' | 'packages';
  description: string;
  price: number;
  featured: boolean;
  imageUrl: string;
  features: string[];
  specs: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  content: string;
  avatarUrl: string;
  rating: number;
}

export interface WeddingGuestbook {
  id: string;
  name: string;
  relation: string;
  message: string;
  createdAt: string;
}

export interface WeddingRSVP {
  id: string;
  name: string;
  attendance: 'hadir' | 'belum_pasti' | 'tidak_hadir';
  guestsCount: number;
  wishes: string;
  createdAt: string;
}

export interface ConsultationRequest {
  id: string;
  schoolName: string;
  contactName: string;
  phone: string;
  serviceNeeded: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}
