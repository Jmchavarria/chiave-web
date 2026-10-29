// Respuesta Estándar para Entidades Únicas (POST, PATCH, findById)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Respuesta Paginada para Listas (findAll, findByUserId)
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
