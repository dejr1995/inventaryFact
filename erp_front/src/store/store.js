import { configureStore } from "@reduxjs/toolkit";
import { productsAllFetch, ProductSlice } from "./slices/ProductSlice";
import { providersAllFetch, ProviderSlice } from "./slices/ProviderSlice";
import { entranceEntriesFetch, entranceSlice } from "./slices/EntranceSlice";
import { clientsAllFetch, ClientSlice } from "./slices/ClientSlice";
import { fetchSales, SaleSlice } from "./slices/SaleSlice";
import { CompanySlice } from "./slices/CompanySlice";
import { AuthSlice } from "./slices/AuthSlice";
import { ReportSlice } from "./slices/ReportSlice";
import { CategorieSlice, fetchCategories } from "./slices/CategorieSlice";

export const store = configureStore({
    reducer:{
        products: ProductSlice.reducer,
        providers: ProviderSlice.reducer,
        entrances: entranceSlice.reducer,
        clients: ClientSlice.reducer,
        sales: SaleSlice.reducer,
        company: CompanySlice.reducer,
        auth: AuthSlice.reducer,
        reports: ReportSlice.reducer,
        categories: CategorieSlice.reducer,
    },
});

store.dispatch(productsAllFetch());
store.dispatch(providersAllFetch());
store.dispatch(entranceEntriesFetch());
store.dispatch(clientsAllFetch());
store.dispatch(fetchSales());
store.dispatch(fetchCategories());

