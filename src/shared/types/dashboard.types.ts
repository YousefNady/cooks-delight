// =============================================================================
// DummyJSON API — TypeScript Interfaces
// Source: https://dummyjson.com/users/1 | https://dummyjson.com/docs/recipes
// =============================================================================

// ---------------------------------------------------------------------------
// Shared / primitive sub-types
// ---------------------------------------------------------------------------

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface UserHair {
  color: string;
  type: string;
}

export interface UserBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface UserCompany {
  department: string;
  name: string;
  title: string;
  address: Address;
}

export interface UserCrypto {
  coin: string;
  wallet: string;
  network: string;
}

/**
 * Mirrors the full response shape of GET /users/:id from DummyJSON.
 * All fields are typed exactly as the API returns them.
 * Fields your feature doesn't need can be safely ignored at the call-site;
 * keeping them here ensures the interface stays the single source of truth.
 */
export interface DummyJSONUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  /** Never expose `password` in UI — included for completeness of the schema */
  password: string;
  birthDate: string;
  /** Absolute URL, e.g. "https://dummyjson.com/icon/emilys/128" */
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: UserHair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: UserBank;
  company: UserCompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: UserCrypto;
  role: string;
}

/** Paginated list wrapper returned by GET /users */
export interface DummyJSONUsersResponse {
  users: DummyJSONUser[];
  total: number;
  skip: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Recipe
// ---------------------------------------------------------------------------

/**
 * Mirrors the full response shape of GET /recipes/:id from DummyJSON.
 */
export interface DummyJSONRecipe {
  id: number;
  name: string;
  /** Step-by-step list of ingredients, e.g. ["Pizza dough", "Tomato sauce"] */
  ingredients: string[];
  /** Ordered cooking instructions */
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  /** ID of the DummyJSON user who authored this recipe */
  userId: number;
  /** Absolute URL, e.g. "https://cdn.dummyjson.com/recipe-images/1.webp" */
  image: string;
  rating: number;
  reviewCount: number;
  /** e.g. ["Dinner"] | ["Breakfast", "Lunch"] */
  mealType: string[];
}

/** Paginated list wrapper returned by GET /recipes */
export interface DummyJSONRecipesResponse {
  recipes: DummyJSONRecipe[];
  total: number;
  skip: number;
  limit: number;
}