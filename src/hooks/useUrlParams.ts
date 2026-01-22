import { useEffect, useState } from 'react';

export const useUrlParams = () => {
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    // Get path from URL (simulating Bubble's "Get path from page URL")
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Check for application ID in path or query params
    const pathParts = path.split('/').filter(Boolean);
    const idFromPath = pathParts[pathParts.length - 1];
    const idFromQuery = searchParams.get('id') || searchParams.get('applicationId');

    if (idFromPath && idFromPath !== '_rental-app-manage') {
      setApplicationId(idFromPath);
    } else if (idFromQuery) {
      setApplicationId(idFromQuery);
    }
  }, []);

  const updateUrl = (id: string | null) => {
    if (id) {
      window.history.pushState({}, '', `?id=${id}`);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
    setApplicationId(id);
  };

  return { applicationId, updateUrl };
};

export default useUrlParams;
