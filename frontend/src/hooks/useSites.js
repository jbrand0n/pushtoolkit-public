import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sitesService } from '../services/sites';
import useSiteStore from '../stores/siteStore';
import useAuthStore from '../stores/authStore';

function useSites() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setSites, setCurrentSite, currentSite } = useSiteStore();

  const { data: sitesResponse, isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: sitesService.getSites,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Backend returns { success: true, data: { sites: [...] } }
    const sitesList = sitesResponse?.data?.sites;

    if (sitesList && sitesList.length > 0) {
      setSites(sitesList);

      // Set first site as current if none selected
      if (!currentSite) {
        setCurrentSite(sitesList[0]);
      }
    }
  }, [sitesResponse, setSites, setCurrentSite, currentSite]);

  return { sites: sitesResponse?.data?.sites || [], isLoading, error };
}

export default useSites;
