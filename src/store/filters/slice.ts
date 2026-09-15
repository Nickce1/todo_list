import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DateFilterMode,
  SortDirection,
  SortOption,
} from "@/lib/task-filters";

type FiltersState = {
  query: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  dateMode: DateFilterMode;
  createdDate: string;
  isOpen: boolean;
};

const initialState: FiltersState = {
  query: "",
  sortBy: "date-start",
  sortDirection: "desc",
  dateMode: "from",
  createdDate: "",
  isOpen: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload;
    },
    toggleSortDirection(state) {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    },
    setDateMode(state, action: PayloadAction<DateFilterMode>) {
      state.dateMode = action.payload;
    },
    setCreatedDate(state, action: PayloadAction<string>) {
      state.createdDate = action.payload;
    },
    toggleFiltersOpen(state) {
      state.isOpen = !state.isOpen;
    },
    clearFilters(state) {
      state.query = "";
      state.createdDate = "";
      state.dateMode = "from";
    },
  },
});

export const {
  setQuery,
  setSortBy,
  setSortDirection,
  toggleSortDirection,
  setDateMode,
  setCreatedDate,
  toggleFiltersOpen,
  clearFilters,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
