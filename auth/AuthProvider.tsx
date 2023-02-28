import {useState, useEffect, createContext} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { IRole } from '../interfaces';
import { auth, getRole } from '../utils/firebase';

const AuthContext = createContext(
  {
    user: null, 
    role: 'user', 
    setRole: (role: IRole) => {},
    loadingRole: true,
    setLoadingRole: (loading: boolean) => {}
  }
);

export function AuthProvider({children}) {
  const [user] = useAuthState(auth);
  const [loadingRole, setLoadingRole] = useState<boolean>(true);
  const [role, setRole] = useState<IRole>('user');
  useEffect(() => {
    if(!user) setRole('user');
    (async () => {
      const result = await getRole(user);
      setRole(result);
      setLoadingRole(false);
    })()
  }, [user])

  return (
    <AuthContext.Provider value={{user, role, setRole, loadingRole, setLoadingRole}}>
      {
        children
      }
    </AuthContext.Provider>
  )
}

export default AuthContext