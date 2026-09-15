import type { RootState } from "@/store/types";

export const selectFilters = (state: RootState) => state.filters;
export const selectFilterQuery = (state: RootState) => state.filters.query;
export const selectSortBy = (state: RootState) => state.filters.sortBy;
export const selectSortDirection = (state: RootState) =>
  state.filters.sortDirection;
export const selectDateMode = (state: RootState) => state.filters.dateMode;
export const selectCreatedDate = (state: RootState) => state.filters.createdDate;
export const selectFiltersOpen = (state: RootState) => state.filters.isOpen;
