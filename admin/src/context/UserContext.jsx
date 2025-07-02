import { createContext } from 'react';

export const UserContext = createContext({
  userAuth: {
    access_token: null,
    userInfo: null
  }
});


export const gstOptions = [
  { label: '5%', value: 0.05 },
  { label: '12%', value: 0.12 },
  { label: '18%', value: 0.18 },
  { label: 'Exempt', value: 0.00 }
];