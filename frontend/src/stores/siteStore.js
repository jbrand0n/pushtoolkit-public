import { create } from 'zustand';

const useSiteStore = create((set) => ({
  currentSite: null,
  sites: [],

  setCurrentSite: (site) => set({ currentSite: site }),

  setSites: (sites) => set({ sites }),

  addSite: (site) => set((state) => ({
    sites: [...state.sites, site]
  })),

  updateSite: (siteId, updatedData) => set((state) => ({
    sites: state.sites.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ),
    currentSite: state.currentSite?.id === siteId
      ? { ...state.currentSite, ...updatedData }
      : state.currentSite
  })),

  removeSite: (siteId) => set((state) => ({
    sites: state.sites.filter(site => site.id !== siteId),
    currentSite: state.currentSite?.id === siteId ? null : state.currentSite
  })),
}));

export default useSiteStore;
