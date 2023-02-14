import dynamic from "next/dynamic";

const AdminComponent : any = dynamic(() => import("../components/admin/AdminComponent"), { ssr: false });

function admin() {
  return (
    <AdminComponent />
  )
}

export default admin