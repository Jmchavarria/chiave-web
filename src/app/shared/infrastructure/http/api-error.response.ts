export interface ApiErrorPayload {
  error?: {
    message?: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}
