import { ApiResponse, PaginationMeta } from './movie.types';

export const createSuccessResponse = <T>(data: T, pagination?: PaginationMeta): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
};
