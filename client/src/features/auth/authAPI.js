import { apiClient } from '../../lib/api-client';
import { LOGIN_ROUTE } from '../../utils/constants';

export const loginAPI = async (credentials) => {
  try {
    const response = await apiClient.post(LOGIN_ROUTE, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};