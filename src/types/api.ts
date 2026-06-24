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

/** ResponseAuthDTO — tokens + basic user info. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
  role: UserRole;
}

/** ResponseUserDTO */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  reputation?: number;
  isVerifiedSeller?: boolean;
  role: UserRole;
}

export type ListingMode = 'FIXED' | 'AUCTION';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED';
export type AuctionStatus = 'ACTIVE' | 'FINISHED' | 'CANCELLED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

/** ResponseCategoryDTO */
export interface Category {
  id: number;
  name: string;
  description?: string;
}

/** ResponseTagDTO */
export interface Tag {
  id: number;
  name: string;
}

/** ResponseAuctionSummaryDTO — embedded in listings and auction lists. */
export interface AuctionSummary {
  id: number;
  currentPrice?: number;
  endsAt?: string;
  status?: AuctionStatus;
}

/** ResponseListingDTO */
export interface Listing {
  id: number;
  title: string;
  description?: string;
  mode: ListingMode;
  fixedPrice?: number;
  condition?: string;
  status?: ListingStatus;
  createdAt?: string;
  seller?: UserProfile;
  category?: Category;
  imageUrls?: string[];
  auction?: AuctionSummary;
}

/** ResponseAuctionDTO */
export interface Auction {
  id: number;
  startingPrice?: number;
  currentPrice?: number;
  startedAt?: string;
  endsAt?: string;
  status?: AuctionStatus;
  winner?: UserProfile;
  totalBids?: number;
}

/** ResponseBidDTO */
export interface Bid {
  id: number;
  amount: number;
  placedAt?: string;
  bidder?: UserProfile;
}

/** ResponseOrderDTO */
export interface Order {
  id: number;
  amount?: number;
  status?: OrderStatus;
  createdAt?: string;
  listing?: Listing;
  buyer?: UserProfile;
  seller?: UserProfile;
}

/** ResponseImageDTO */
export interface ListingImage {
  id: number;
  url: string;
  sortOrder?: number;
  listingId?: number;
}

/** Spring-style paginated response. */
export interface PageResponse<T> {
  content: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface CreateListingRequest {
  title: string;
  description?: string;
  mode: ListingMode;
  fixedPrice?: number;
  condition: string;
  categoryId: number;
  tags?: string[];
}

export interface CreateAuctionRequest {
  listingId: number;
  startingPrice: number;
  endsAt: string;
}

export interface PlaceBidRequest {
  auctionId: number;
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
