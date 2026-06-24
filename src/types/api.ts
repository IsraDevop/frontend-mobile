export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/** Login/register response. Field names are tolerated flexibly in the auth service. */
export interface AuthResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  tokenType?: string;
  user?: SessionUser;
}

export interface SessionUser {
  id: string | number;
  email: string;
  name: string;
  role: UserRole;
}

export interface UserProfile extends SessionUser {
  avatarUrl?: string;
  reputation?: number;
  isVerifiedSeller?: boolean;
}

export type ListingMode = 'DIRECT' | 'AUCTION' | string;
export type ListingCondition = 'NEW' | 'USED' | 'LIKE_NEW' | string;

export interface ListingImage {
  id?: string | number;
  url: string;
  sortOrder?: number;
}

export interface Listing {
  id: string | number;
  title: string;
  description?: string;
  price?: number;
  mode?: ListingMode;
  condition?: ListingCondition;
  categoryId?: string | number;
  category?: Category | string;
  images?: ListingImage[];
  imageUrl?: string;
  sellerId?: string | number;
  sellerName?: string;
  storeName?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug?: string;
}

/** Spring-style paginated response. `content` is the only field we rely on. */
export interface PageResponse<T> {
  content: T[];
  number?: number;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  first?: boolean;
}

export interface Auction {
  id: string | number;
  listingId: string | number;
  listing?: Listing;
  title?: string;
  startingPrice?: number;
  currentPrice?: number;
  endsAt?: string;
  totalBids?: number;
  winnerId?: string | number;
  status?: string;
  imageUrl?: string;
}

export interface Bid {
  id: string | number;
  auctionId: string | number;
  amount: number;
  bidderId?: string | number;
  bidderName?: string;
  createdAt?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | string;

export interface Order {
  id: string | number;
  listingId: string | number;
  listing?: Listing;
  buyerId?: string | number;
  status?: OrderStatus;
  total?: number;
  createdAt?: string;
}

export interface CreateListingRequest {
  title: string;
  description?: string;
  price: number;
  mode?: ListingMode;
  condition?: ListingCondition;
  categoryId?: string | number;
  latitude?: number;
  longitude?: number;
  storeName?: string;
}

export interface CreateAuctionRequest {
  listingId: string | number;
  startingPrice: number;
  endsAt: string;
}

export interface PlaceBidRequest {
  auctionId: string | number;
  amount: number;
}

export interface DniVerificationRequest {
  personalNumber: string;
  firstName?: string;
  lastName?: string;
}

export interface DniVerificationResult {
  status: 'Approved' | 'Declined';
  matchType?: 'full_match' | 'no_match' | string;
  message?: string;
}
