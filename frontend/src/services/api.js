const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const fetchCars = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v && v !== 'All')
  ).toString();
  return request(`/api/cars${qs ? `?${qs}` : ''}`);
};

export const fetchCar = (id) => request(`/api/cars/${id}`);
