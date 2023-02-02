import { FacebookFilled, GithubFilled, YoutubeFilled } from '@ant-design/icons';
import { Button, Col, Layout, Row, Space, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import Logo from "../public/icons/DSC_LOGO.png";
import graphPreviewImage from "../public/icons/login-graph-preview.png";
import { auth } from "../utils/firebase";

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
};

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
};

export default function LoginPage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = () => {
    signInWithGoogle();
  };

  const imgStyle = { width: "100%", height: "auto" };

  return (
    <>
      <Layout>
        <Header style={headerStyle}>
          <Image src={Logo} alt="DSC logo" />
        </Header>
        <Content style={contentStyle}>
          <Row justify="center">
            <Col span={6}>
              <Space direction="vertical">
                <Typography.Title>
                  DSC Force Graph
                </Typography.Title>
                <Typography.Paragraph>
                  "DSC Force Graph" is a website that displays information as a graph with interconnected nodes. Each node in the graph represents a lesson or exercise and has a note attached to it to save additional information. The nodes are connected to each other to represent the relationships between the lessons or exercises. The tool uses a force-directed graph layout to arrange the nodes, making it visually appealing and easy to navigate.
                </Typography.Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={signIn}
                >
                  Sign In With Google
                </Button>
                {/* <p>{JSON.stringify(user)}</p> */}
                <Space direction="horizontal" size="middle">
                  <Typography.Text>Follow us on:</Typography.Text>
                  <Link href={"#"}>
                    <FacebookFilled />
                  </Link>
                  <Link href={"#"}>
                    <YoutubeFilled />
                  </Link>
                  <Link href={"#"}>
                    <GithubFilled />
                  </Link>
                </Space>
              </Space>
            </Col>
            <Col span={6}>
              <Image
                src={graphPreviewImage}
                alt="Preview of 3D Graph"
                style={imgStyle}
              />
            </Col>
          </Row>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </>
    
  );
}
