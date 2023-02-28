import dynamic from "next/dynamic";
import { useContext } from 'react';
import AuthContext from "../auth/AuthProvider";
import MainFooter from "../components/common/MainFooter";
import MainHeader from "../components/common/MainHeader";
import Loading from "../components/Loading";

const AdminComponent : any = dynamic(() => import("../components/admin/AdminComponent"), { ssr: false });

function admin() {
  const authProvider = useContext(AuthContext);

  return (
    <>
      {
        authProvider.role === 'admin' ? (
          <>
            <MainHeader />
            <AdminComponent />
            <MainFooter />
          </>
        ) : (<>
        {
          authProvider.loadingRole ? <Loading /> : <h1>Not authorized</h1>
        }
        </>)
      }
    </>
  )
}

export default admin