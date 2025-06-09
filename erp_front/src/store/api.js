export const url = {
    apiproducts: 'http://localhost:3000/api',
    apiproviders: 'http://localhost:3000/api',
    apientrances: 'http://localhost:3000/api',
    apiclients: 'http://localhost:3001/api',
    apisales: 'http://localhost:3002/api',
    apicompany: 'http://localhost:3002/api',
    apiauth: 'http://localhost:3003/api',
}

export const ReportTypes = {
    SALES: 'sales',
    LOW_STOCK: 'low-stock',
    CLIENT_ACTIVITY: 'client-activity',
    PROVIDER_PURCHASES: 'provider-purchases'
};
  
export const setHeaders = () => {
    const token = localStorage.getItem("token");
    
    return {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };