import { kyApi } from "./api.instance";

/**
 * Custom instance for Orval
 * This instance uses the centralized kyApi instance.
 */
export const customInstance = async <T>(
  url: string,
  options?: any,
): Promise<T> => {
  const response = await kyApi(url, options);
  return response.json<T>();
};

export default customInstance;
