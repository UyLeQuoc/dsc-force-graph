import { Image } from "antd";
import { useRecordContext } from "react-admin";

const MyImageField = ({ source }: any) => {
  const record = useRecordContext();
  if (!record) return null;
  return <Image src={record[source].src} alt={record[source].title} width={100} height={50}/>;
};

export default MyImageField;
