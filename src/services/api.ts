/**
 * API Service - Cliente HTTP para integração com Backend
 * Gerencia todas as requisições da aplicação ao servidor Node.js
 */

const API_BASE_URL = 'http://localhost:3000/api';

let authToken: string | null = localStorage.getItem('authToken');

const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Auth endpoints
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao fazer login');
      }
      
      setAuthToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erro ao conectar com o servidor. Verifique se o backend está rodando em localhost:5000');
    }
  },

  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return response.ok;
  },

  logout: () => {
    clearAuthToken();
  },
};

// Public Events API
export const publicEventsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/events`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar eventos');
    }
    
    return response.json();
  },
};

// Events endpoints
export const eventsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar eventos');
    }
    
    return response.json();
  },

  getAllWithCounts: async () => {
    const response = await fetch(`${API_BASE_URL}/events/public/with-counts`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar eventos');
    }
    
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar evento');
    }
    
    return response.json();
  },

  create: async (eventData: any) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar evento');
    }
    
    return response.json();
  },

  update: async (id: string, eventData: any) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar evento');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar evento');
    }
    
    return response.json();
  },
};

// Chapels endpoints
export const chapelsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/chapels`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar capelas');
    }
    
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/chapels/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar capela');
    }
    
    return response.json();
  },

  create: async (chapelData: any) => {
    const response = await fetch(`${API_BASE_URL}/chapels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(chapelData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar capela');
    }
    
    return response.json();
  },

  update: async (id: string, chapelData: any) => {
    const response = await fetch(`${API_BASE_URL}/chapels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(chapelData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar capela');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/chapels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar capela');
    }
    
    return response.json();
  },
};

// Clergy endpoints
export const clergyAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clergy`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar clero');
    }
    
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/clergy/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar membro');
    }
    
    return response.json();
  },

  create: async (memberData: any) => {
    const response = await fetch(`${API_BASE_URL}/clergy`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar membro');
    }
    
    return response.json();
  },

  update: async (id: string, memberData: any) => {
    const response = await fetch(`${API_BASE_URL}/clergy/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar membro');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/clergy/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar membro');
    }
    
    return response.json();
  },
};

// Guides endpoints
export const guidesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/guides`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar guias');
    }
    
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/guides/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar guia');
    }
    
    return response.json();
  },

  create: async (guideData: any) => {
    const response = await fetch(`${API_BASE_URL}/guides`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(guideData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar guia');
    }
    
    return response.json();
  },

  update: async (id: string, guideData: any) => {
    const response = await fetch(`${API_BASE_URL}/guides/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(guideData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar guia');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/guides/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar guia');
    }
    
    return response.json();
  },
};

// Inscriptions endpoints
export const inscriptionsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/inscriptions`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar inscrições');
    }
    
    return response.json();
  },

  getByEvent: async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/inscriptions/event/${eventId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar inscrições');
    }
    
    return response.json();
  },

  getConfirmedByEvent: async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/inscriptions/event/${eventId}/confirmadas`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar inscrições confirmadas');
    }
    
    return response.json();
  },

  create: async (inscriptionData: any) => {
    const response = await fetch(`${API_BASE_URL}/inscriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(inscriptionData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar inscrição');
    }
    
    return response.json();
  },

  update: async (id: string, inscriptionData: any) => {
    const response = await fetch(`${API_BASE_URL}/inscriptions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(inscriptionData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar inscrição');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/inscriptions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar inscrição');
    }
    
    return response.json();
  },
};

// Content Text endpoints
export const contentAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/content`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar textos');
    }
    
    return response.json();
  },

  getByKey: async (key: string) => {
    const response = await fetch(`${API_BASE_URL}/content/${key}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar texto');
    }
    
    return response.json();
  },

  create: async (contentData: any) => {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contentData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar texto');
    }
    
    return response.json();
  },

  update: async (id: string, contentData: any) => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contentData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar texto');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar texto');
    }
    
    return response.json();
  },
};

// Upload endpoints
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      
      // Converter URL relativa em absoluta
      if (data.imageUrl && data.imageUrl.startsWith('/')) {
        data.imageUrl = `${API_BASE_URL.replace('/api', '')}${data.imageUrl}`;
      }
      
      return data;
    } catch (error) {
      throw new Error(`Erro ao fazer upload: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
  },
};

export { setAuthToken, clearAuthToken, getAuthHeaders };
