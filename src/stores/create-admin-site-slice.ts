import { SliceCreator } from 'stores/use-app-store';

export interface AdminSiteState {
  opened: boolean;
  toggleOpened: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const initialAdminSiteState = {
  opened: false,
  collapsed: false,
};

const createAdminSiteSlice: SliceCreator<AdminSiteState> = (set) => ({
  ...initialAdminSiteState,
  toggleOpened: () => set((state) => ({ opened: !state.opened })),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
});

export default createAdminSiteSlice;
