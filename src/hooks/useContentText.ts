import { contentAPI } from '../services/api';

export const useContentText = async (key: string) => {
  try {
    const response = await contentAPI.getByKey(key);
    return response;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo ${key}:`, error);
    return null;
  }
};
