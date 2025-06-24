// /context/UserContext.jsx
import { createContext } from 'react';

export const UserContext = createContext({
  userAuth: {
    access_token: null,
    userInfo: null
  }
});
