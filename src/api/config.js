export const URL = 'http://localhost:5000'
export const authenticate = token => ({headers: {Authorization: `Bearer ${token}`}})