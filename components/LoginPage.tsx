import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { Button, Space } from "antd";
import DSCLogo from "../public/icons/DSC-logo.svg";
import Image from "next/image";
import Logo from "../public/icons/DSC_LOGO.png";
import graphPreviewImage from "../public/icons/login-graph-preview.png";

export default function LoginPage() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = () => {
    signInWithGoogle();
  };

  const imgStyle = { width: "100%", height: "auto" };

  return (
    <div className="login-container">
      <div className="logo">
        <Image src={Logo} alt="DSC logo" style={imgStyle} />
      </div>
      <div className="hero">
        <div className="hero-action">
          <div className="hero-action-title">DSC Force Graph</div>
          <div className="hero-action-subtitle">
            Visualize your Learing Path in 3D - A graph builder built by DSC
          </div>
          <Button
            type="primary"
            size="large"
            onClick={signIn}
            className="signin-button"
          >
            Sign In With Google
          </Button>
          {/* <p>{JSON.stringify(user)}</p> */}
          <div className="hero-action-social-links">
            Contact:
            <a href="">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a href="">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 9.333l5.333 2.662-5.333 2.672v-5.334zm14-4.333v14c0 2.761-2.238 5-5 5h-14c-2.761 0-5-2.239-5-5v-14c0-2.761 2.239-5 5-5h14c2.762 0 5 2.239 5 5zm-4 7c-.02-4.123-.323-5.7-2.923-5.877-2.403-.164-7.754-.163-10.153 0-2.598.177-2.904 1.747-2.924 5.877.02 4.123.323 5.7 2.923 5.877 2.399.163 7.75.164 10.153 0 2.598-.177 2.904-1.747 2.924-5.877z" />
              </svg>
            </a>
            <a href="">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.466 19.59c-.405.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.312-1.588-.823-2.147.082-.202.356-1.016-.079-2.117 0 0-.671-.215-2.198.82-.64-.18-1.324-.267-2.004-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-img">
          <Image
            src={graphPreviewImage}
            alt="Preview of 3D Graph"
            style={imgStyle}
          />
        </div>
      </div>
    </div>
  );
}
