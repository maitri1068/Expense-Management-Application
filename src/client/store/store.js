import { createSlice, configureStore } from "@reduxjs/toolkit";

const storeSlice = createSlice({
  name: "reduxStore",
  initialState: {
    formfield: [],
    formValidation: {},
    tableviewfield: [],
    pageRights: {},
    modal: {},
    FormData: {},
    data: [],
    info: [],
    form: 1,
    userinfo: {},
    Category: [],
    chartdata: [],
    chartinfo: [],
    expensechartdata:[],
    incomechartdata:[],
    preview:{},
  
  },
  reducers: {
    setdata: (state, action) => {
      state.preview = action.payload.preview
      ? action.payload.preview 
      : state.preview ;
      state.form = action.payload.form ? action.payload.form : state.form;
   
      state.info = action.payload.info
        ? [...action.payload.info]
        : [...state.info];
      state.data = action.payload.data
        ? [...action.payload.data]
        : [...state.data];
      state.FormData = action.payload.FormData
        ? { ...action.payload.FormData }
        : { ...state.FormData };
      state.modal = action.payload.modal
        ? { ...state.modal, ...action.payload.modal }
        : { ...state.modal };
      state.formfield = action.payload.formfield
        ? [...action.payload.formfield]
        : [...state.formfield];
      state.formValidation = action.payload.formValidation
        ? { ...action.payload.formValidation }
        : { ...state.formValidation };
      state.tableviewfield = action.payload.tableviewfield
        ? [...action.payload.tableviewfield]
        : [...state.tableviewfield];
      state.pageRights = action.payload.pageRights
        ? { ...action.payload.pageRights }
        : { ...state.pageRights };
      state.userinfo = action.payload.userinfo
        ? { ...action.payload.userinfo }
        : { ...state.userinfo };
      state.Category = action.payload.Category
        ? [...action.payload.Category]
        : [...state.Category];
      state.chartdata = action.payload.chartdata
        ? [...action.payload.chartdata]
        : [...state.chartdata];
      state.chartinfo = action.payload.chartinfo
        ? [...action.payload.chartinfo]
        : [...state.chartinfo];
        state.expensechartdata = action.payload.expensechartdata
        ? [...action.payload.expensechartdata]
        : [...state.expensechartdata];
        state.incomechartdata = action.payload.incomechartdata
        ? [...action.payload.incomechartdata]
        : [...state.incomechartdata];
    },
    storedata: (state, action) => {
      state.info.push({ ...action.payload, sid: state.info.length });
    },
  },
});

export const { setdata, storedata } = storeSlice.actions;
export const counterReducer = storeSlice.reducer;

const store = configureStore({
  reducer: {
    stud: counterReducer,
  },
  //   middleware:(getDefaultMiddleware)=>getDefaultMiddleware(),
});

export default store;
