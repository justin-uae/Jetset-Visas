
export type VisaCategory =
  | 'Tourist'
  | 'Business'
  | 'Transit'
  | 'Multiple Entry'
  | 'E-Visa'
  | 'Sticker Visa';

export type EntryType =
  | 'Single Entry'
  | 'Multiple Entry'
  | 'Double Entry';

export interface VisaVariant {
  id: string;
  shopifyId: string;
  title: string;
  price: number;
  available: boolean;
  sku?: string;
}

export interface VisaAddon {
  id: string;
  shopifyId?: string;
  title: string;
  price: number;
  description: string;
  variantId?: string;
  available?: boolean;
}

export interface VisaProduct {
  id: string;
  shopifyId: string;
  handle: string;
  title: string;
  country: string;
  flag: string;
  category: string;
  duration: string;
  entryType: string;
  price: number;
  childPrice?: number | null;
  processingTime: string;
  validityPeriod: string;
  stayPeriod: string;
  images: string[];
  description: string;
  descriptionHtml?: string;
  features: string[];
  requirements: string[];
  importantNotes: string[];
  addons: VisaAddon[];
  variants: VisaVariant[];
  tags: string[];
  productType: string;
}

export interface VisaFilters {
  category: VisaCategory | 'ALL';
  country: string;
  entryType: EntryType | 'ALL';
  priceRange: {
    min: number;
    max: number;
  };
  duration: string;
}

export interface VisaCartItem {
  visa: VisaProduct;
  quantity: number;
  selectedVariant?: VisaVariant; // Selected variant (Adult/Child)
  addons: VisaAddon[];
  applicantInfo?: {
    name: string;
    nationality: string;
    passportNumber: string;
  };
}

export interface VisaState {
  allVisas: VisaProduct[];
  filteredVisas: VisaProduct[];
  filters: VisaFilters;
  loading: boolean;
  error: string | null;
  selectedVisa: VisaProduct | null;
}

export interface CartState {
  items: VisaCartItem[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}