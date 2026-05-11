import { kyApi } from "./api.instance";

/**
 * Custom instance for Orval
 * This instance uses the centralized kyApi instance.
 */
export const customInstance = async <T>(
  url: string,
  options?: any,
): Promise<T> => {
  try {
    const response = await kyApi(url, options);

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : undefined;
    } catch (err) {
      data = undefined;
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
    } as unknown as T;
  } catch (error: any) {
    if (error.response) {
      try {
        const text = await error.response.text();
        error.response.data = text ? JSON.parse(text) : undefined;
      } catch (e) {
        error.response.data = undefined;
      }
    }
    throw error;
  }
};

export default customInstance;
