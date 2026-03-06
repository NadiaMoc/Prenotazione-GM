const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || 'Errore di rete.';
    throw new Error(message);
  }

  return payload;
};

export const api = {
  async getEventos() {
    const response = await fetch(`${API_BASE_URL}/eventos`);
    return parseResponse(response);
  },

  async createEvento(data) {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return parseResponse(response);
  },

  async getDisponibilidad(eventoId) {
    const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/disponibilidad`);
    return parseResponse(response);
  },

  async getReservasEvento(eventoId) {
    const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/reservas`);
    return parseResponse(response);
  },

  async createReserva(data) {
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return parseResponse(response);
  },

  async deleteReserva(reservaId) {
    const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}`, {
      method: 'DELETE'
    });

    return parseResponse(response);
  },

  async deleteEvento(eventoId) {
    const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}`, {
      method: 'DELETE'
    });

    return parseResponse(response);
  }
};
