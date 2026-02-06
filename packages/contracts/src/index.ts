export type BirthInput = {
  date_of_birth: string;   // YYYY-MM-DD
  time_of_birth?: string;  // HH:MM optional
  place_of_birth?: string; // city,country optional for MVP
  timezone?: string;       // IANA optional (auto in future)
  locale: 'ru' | 'en';
};

export type StructuredProfile = {
  meta: {
    has_time_of_birth: boolean;
    limitations: string[];
  };
  astrology: Record<string, unknown>;
  numerology: Record<string, unknown>;
  archetypes: Record<string, unknown>;
};

export type InterpretationRequest = {
  profile: StructuredProfile;
  user_goal?: 'life' | 'love' | 'money' | 'purpose';
};

export type InterpretationResponse = {
  summary: string;
  strengths: string[];
  risks: string[];
  actions: string[];
  notes: string[];
};


export * from './http';
export * from './auth';
export * from './profile';
