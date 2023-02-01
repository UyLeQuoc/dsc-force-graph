import { Avatar, Card, List, Skeleton } from 'antd';
import {SettingOutlined, EditOutlined, EllipsisOutlined} from '@ant-design/icons';
import { useState } from 'react';
import Link from 'next/link';

function GraphCard({id, title, owner, lastModified} : {id:string, title: string, owner: string, lastModified: any}) : JSX.Element {
  const [loading, setLoading] = useState(false);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };


  return (
    <Card size="small" title={`${title}`} extra={<Link href={`/edit/${id}`} rel="noopener noreferrer" target="_blank">View</Link>} style={{ width: 300 }}>
      <Skeleton loading={loading} active>
        <p>ID: {id}</p>
        <p>Owner: {owner}</p>
      </Skeleton>
    </Card>
    
  )
}

export default GraphCard