import dynamic from "next/dynamic";

const AdminComponent : any = dynamic(() => import("../components/admin/AdminComponent"), { ssr: false });

const Home = () : JSX.Element => {
  return <>
    <AdminComponent />
  </>;
};

export default Home;