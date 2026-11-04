import { fetchHealth } from '../services/api';

export function useApi() {
  return {
    getHealth: async () => fetchHealth()
  };
}
