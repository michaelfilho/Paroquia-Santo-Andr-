/**
 * API Service - Cliente HTTP para integração com Backend
 * Gerencia todas as requisições da aplicação ao servidor Node.js
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://admin.paroquiataruma.com/api');
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

let authToken: string | null = localStorage.getItem('authToken');
const ADMIN_PROFILE_KEY = 'adminProfile';

const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const setAdminProfile = (admin: any) => {
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(admin));
};

const getAdminProfile = () => {
  const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearAdminProfile = () => {
  localStorage.removeItem(ADMIN_PROFILE_KEY);
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
      if (data.admin) {
        setAdminProfile(data.admin);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erro ao conectar com o servidor. Verifique se o backend está online.');
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
    clearAdminProfile();
  },
};

// Admins endpoints
export const adminsAPI = {
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/admins/me`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar dados do admin');
    }

    return data;
  },

  updateMe: async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}/admins/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar dados do admin');
    }

    return data;
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar administradores');
    }

    return data;
  },

  create: async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar administrador');
    }

    return data;
  },

  update: async (id: string, payload: any) => {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar administrador');
    }

    return data;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao remover administrador');
    }

    return data;
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

  // Eventos de inscrição - SOMENTE eventos criados na aba Inscrições
  getInscriptionEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/public/inscription-events`);

    if (!response.ok) {
      throw new Error('Erro ao buscar eventos de inscrição');
    }

    return response.json();
  },
};

// Schedules endpoints
export const schedulesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar programações');
    }

    const data = await response.json();
    return data.map((schedule: any) => ({
      ...schedule,
      time: schedule.timeStart && schedule.timeEnd ? `${schedule.timeStart} às ${schedule.timeEnd}` : schedule.timeStart
    }));
  },

  getPublic: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules/public`);

    if (!response.ok) {
      throw new Error('Erro ao buscar programações públicas');
    }

    const data = await response.json();
    return data.map((schedule: any) => ({
      ...schedule,
      time: schedule.timeStart && schedule.timeEnd ? `${schedule.timeStart} às ${schedule.timeEnd}` : schedule.timeStart
    }));
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar programação');
    }

    const schedule = await response.json();
    return {
      ...schedule,
      time: schedule.timeStart && schedule.timeEnd ? `${schedule.timeStart} às ${schedule.timeEnd}` : schedule.timeStart
    };
  },

  create: async (data: any) => {
    let payload = { ...data };
    if (payload.time && payload.time.includes(' às ')) {
      const parts = payload.time.split(' às ');
      payload.timeStart = parts[0];
      payload.timeEnd = parts[1];
    } else {
      payload.timeStart = payload.time;
    }

    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao criar programação');
    }

    const responseData = await response.json();
    const schedule = responseData?.schedule || responseData;
    return {
      ...schedule,
      time: schedule.timeStart && schedule.timeEnd ? `${schedule.timeStart} às ${schedule.timeEnd}` : schedule.timeStart
    };
  },

  update: async (id: string, data: any) => {
    let payload = { ...data };
    if (payload.time && payload.time.includes(' às ')) {
      const parts = payload.time.split(' às ');
      payload.timeStart = parts[0];
      payload.timeEnd = parts[1];
    } else if (payload.time) {
      payload.timeStart = payload.time;
      payload.timeEnd = '';
    }

    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao atualizar programação');
    }

    const responseData = await response.json();
    const schedule = responseData?.schedule || responseData;
    return {
      ...schedule,
      time: schedule.timeStart && schedule.timeEnd ? `${schedule.timeStart} às ${schedule.timeEnd}` : schedule.timeStart
    };
  },

  publish: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao publicar programação');
    }

    return response.json();
  },

  unpublish: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}/unpublish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao despublicar programação');
    }

    return response.json();
  },

  moveToEvent: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}/move-to-event`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao mover programação para eventos');
    }

    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar programação');
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

  // Admin: get all events including those de inscrição
  getAllAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/events?includeInscription=true`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar eventos (admin)');
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

  publish: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Erro ao publicar evento');
    }

    return response.json();
  },

  unpublish: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/unpublish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Erro ao despublicar evento');
    }

    return response.json();
  },

  archive: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Erro ao arquivar evento');
    }

    return response.json();
  },

  moveToEvent: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/move-to-event`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Erro ao mover evento');
    }

    return response.json();
  },

  moveToProgram: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/move-to-program`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Erro ao mover evento para programação');
    }

    return response.json();
  },
};

// Chapels endpoints
export const chapelsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/chapels`);

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
    const response = await fetch(`${API_BASE_URL}/public/clergy`);

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
    const response = await fetch(`${API_BASE_URL}/public/guides`);

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
    const response = await fetch(`${API_BASE_URL}/public/inscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar inscrição');
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

// Registration links endpoints (Google Forms)
export const registrationLinksAPI = {
  getPublic: async () => {
    const response = await fetch(`${API_BASE_URL}/public/registration-links`);

    if (!response.ok) {
      throw new Error('Erro ao buscar inscrições públicas');
    }

    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/registration-links`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar inscrições');
    }

    return data;
  },

  create: async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}/registration-links`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar inscrição');
    }

    return data;
  },

  update: async (id: string, payload: any) => {
    const response = await fetch(`${API_BASE_URL}/registration-links/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar inscrição');
    }

    return data;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/registration-links/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao remover inscrição');
    }

    return data;
  },
};

// Content Text endpoints
export const contentAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/content?t=${Date.now()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar textos');
    }

    return response.json();
  },

  getByKey: async (key: string) => {
    const response = await fetch(`${API_BASE_URL}/public/content?t=${Date.now()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar texto');
    }

    const allContent = await response.json();
    if (!Array.isArray(allContent)) {
      return null;
    }

    const matches = allContent.filter((item: any) => item?.key === key);
    if (!matches.length) {
      return null;
    }

    matches.sort((a: any, b: any) => {
      const aTime = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const bTime = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      return bTime - aTime;
    });

    return matches[0];
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

// Event Photos endpoints
export const eventPhotosAPI = {
  getByEventId: async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/event-photos/event/${eventId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar fotos do evento');
    }

    return response.json();
  },

  upload: async (eventId: string, files: FileList) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const authHeaders = getAuthHeaders();
    delete authHeaders['Content-Type']; // Let browser set it with boundary

    const response = await fetch(`${API_BASE_URL}/event-photos/event/${eventId}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeaders['Authorization'] || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload das fotos');
    }

    return response.json();
  },

  delete: async (photoId: string) => {
    const response = await fetch(`${API_BASE_URL}/event-photos/${photoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar foto');
    }

    return response.json();
  },
};

// Movements endpoints
export const movementsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/movements`);
    if (!response.ok) {
      throw new Error('Erro ao buscar movimentos pastorais');
    }
    return response.json();
  },

  create: async (data: any) => {
    const { id, ...payload } = data || {};
    const response = await fetch(`${API_BASE_URL}/movements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar movimento pastoral');
    }
    return response.json();
  },

  update: async (id: string, data: any) => {
    const normalizedId = String(id || '').replace(/^:/, '').trim();
    if (!normalizedId) {
      throw new Error('ID inválido para atualizar movimento pastoral');
    }
    const { id: bodyId, ...payload } = data || {};
    const response = await fetch(`${API_BASE_URL}/movements/${encodeURIComponent(normalizedId)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar movimento pastoral');
    }
    return response.json();
  },

  delete: async (id: string, name?: string) => {
    const normalizedId = String(id || '').replace(/^:/, '').trim();
    const normalizedName = String(name || '').trim();
    if (!normalizedId && !normalizedName) {
      throw new Error('ID ou nome inválido para deletar movimento pastoral');
    }

    const endpoint = normalizedId
      ? `${API_BASE_URL}/movements/${encodeURIComponent(normalizedId)}`
      : `${API_BASE_URL}/movements/by-name/${encodeURIComponent(normalizedName)}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar movimento pastoral');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },
};

// Former Priests endpoints
export const formerPriestsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/former-priests`);
    if (!response.ok) {
      throw new Error('Erro ao buscar antigos padres');
    }
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/former-priests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || 'Erro ao criar antigo padre');
    }
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/former-priests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || 'Erro ao atualizar antigo padre');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/former-priests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar antigo padre');
    }
    return response.json();
  },
};

// News endpoints
export const newsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/news`);
    if (!response.ok) {
      throw new Error('Erro ao buscar notícias');
    }
    return response.json();
  },

  create: async (data: any) => {
    const payload = { ...data };
    if (!payload.id || String(payload.id).trim() === '') {
      delete payload.id;
    }
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar notícia');
    }
    return response.json();
  },

  update: async (id: string, data: any) => {
    const payload = { ...data };
    delete payload.id;
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar notícia');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar notícia');
    }
    return response.json();
  },
};

// Carousel endpoints
export const carouselAPI = {
  parseResponse: async (response: Response) => {
    if (response.status === 204) {
      return null;
    }

    const raw = await response.text();
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/public/carousel`);
    if (!response.ok) {
      throw new Error('Erro ao buscar itens do carrossel');
    }
    return carouselAPI.parseResponse(response);
  },

  create: async (data: any) => {
    let response = await fetch(`${API_BASE_URL}/carousel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/public/carousel`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    }

    const payload = await carouselAPI.parseResponse(response);
    if (!response.ok) {
      throw new Error((payload as any)?.error || (payload as any)?.message || 'Erro ao criar item do carrossel');
    }
    return payload;
  },

  update: async (id: string, data: any) => {
    let response = await fetch(`${API_BASE_URL}/carousel/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/public/carousel/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    }

    const payload = await carouselAPI.parseResponse(response);
    if (!response.ok) {
      throw new Error((payload as any)?.error || (payload as any)?.message || 'Erro ao atualizar item do carrossel');
    }
    return payload;
  },

  delete: async (id: string) => {
    let response = await fetch(`${API_BASE_URL}/carousel/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/public/carousel/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    }

    const payload = await carouselAPI.parseResponse(response);
    if (!response.ok) {
      throw new Error((payload as any)?.error || (payload as any)?.message || 'Erro ao deletar item do carrossel');
    }
    return payload;
  },
};

export const candlesAPI = {
  getCount: async () => {
    const response = await fetch(`${API_BASE_URL}/public/candles/count`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contador de velas');
    }
    return response.json();
  },

  increment: async () => {
    const response = await fetch(`${API_BASE_URL}/public/candles/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao incrementar contador de velas');
    }

    return response.json();
  },
};

export const siteVisitsAPI = {
  getCount: async () => {
    const response = await fetch(`${API_BASE_URL}/public/site-visits/count`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contador de acessos');
    }
    return response.json();
  },

  increment: async () => {
    const response = await fetch(`${API_BASE_URL}/public/site-visits/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao incrementar contador de acessos');
    }

    return response.json();
  },
};

export const prayerRequestsAPI = {
  create: async (intention: string) => {
    const response = await fetch(`${API_BASE_URL}/public/prayer-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ intention }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao registrar pedido de oração');
    }

    return data;
  },
};

export { setAuthToken, clearAuthToken, getAuthHeaders, setAdminProfile, getAdminProfile, clearAdminProfile };
