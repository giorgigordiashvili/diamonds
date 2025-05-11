'use client';
import { useCart } from '@/context/CartContext'; // Import useCart
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginPopup from './LoginPopup'; // Import LoginPopup
import RegisterPopup from './RegisterPopup'; // Import RegisterPopup

const Styledhead = styled.div`
  position: fixed;
  top: 0;
  z-index: 20;
  width: 100%;
  height: 52px;
  margin-bottom: 52px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding-inline: 48px;
  background-color: rgba(242, 242, 241, 1);
  @media screen and (max-width: 1267px) {
    padding-inline: 0px;
  }
  @media screen and (max-width: 1171px) {
    padding-inline: 24px;
  }
  @media screen and (max-width: 820px) {
    justify-content: center;
  }
  @media screen and (max-width: 710px) {
    height: 64px;
  }
`;
const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin-left: 26px;
  margin-right: auto;
  @media screen and (max-width: 1171px) {
    display: none;
  }
`;
const Tab = styled.div`
  padding-inline: 24px;
  font-weight: 600;
  font-size: 14;
  line-height: 16px;
  color: rgba(125, 125, 125, 1);
`;
const Contact = styled.div`
  width: fit-content;
  display: flex;
  gap: 8px;
  align-items: center;
  color: rgba(8, 8, 8, 1);
  font-weight: 700;
  font-size: 12;
  line-height: 16px;
  position: relative;
  @media screen and (max-width: 460px) {
    font-size: 12px;
    width: 100%;
  }
`;
const Tel = styled.p``;
const Int = styled.p`
  @media screen and (max-width: 710px) {
    display: none;
  }
`;
const Request = styled.div`
  min-width: 160px;
  border: 2px solid black;
  text-align: center;
  line-height: 21px;
  padding: 4px 24px;
  margin-left: 36px;
  cursor: pointer;
  @media screen and (max-width: 1303px) {
    margin-left: 0px;
  }
  @media screen and (max-width: 460px) {
    margin-left: auto;
    height: 44px;
    align-content: center;
  }
`;
const Left = styled.div`
  display: flex;
  width: fit-content;
  @media screen and (max-width: 820px) {
    display: none;
  }
`;
const Logo = styled.div`
  display: block;
  cursor: pointer;
  @media screen and (max-width: 820px) {
    display: none;
  }
`;
const Logosmall = styled.div`
  display: none;
  cursor: pointer;
  @media screen and (max-width: 820px) {
    display: block;
    margin-right: 10px;
  }
`;

const UserProfileIcon = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

const CartIconContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-left: 10px; // Add margin to separate from profile icon or login/request button
`;

const CartCountBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px; // Ensure badge has a minimum width
  height: 18px;
`;

const Header = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { getCartCount } = useCart(); // Get cart count
  const cartItemCount = getCartCount();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    setIsLoggedIn(true);
    console.log('Login successful, token:', token);
    setShowLoginPopup(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterPopup(false);
    setShowLoginPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserName('');
    window.location.reload();
  };

  const switchToRegisterPopup = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  if (pathname?.includes('admin')) return null;
  return (
    <>
      <Styledhead>
        <Left>
          <Image src={'/assets/header/logo.png'} height={22} width={115} alt="logo"></Image>
          <Tabs>
            <Tab>Diamonds</Tab>
            <Tab>Certificates</Tab>
            <Tab>Request</Tab>
          </Tabs>
        </Left>
        <Contact>
          {isLoggedIn ? (
            <>
              <UserProfileIcon onClick={() => alert('Show user profile dropdown or page')}>
                <Image src={'/assets/header/man.png'} alt="profile" width={30} height={30} />
              </UserProfileIcon>
              {userName && <span style={{ marginRight: '10px' }}>Hi, {userName}</span>}
            </>
          ) : (
            <>{/* Register button removed */}</>
          )}
          {/* Cart Icon - visible whether logged in or not */}
          <Link href="/cart" passHref>
            <CartIconContainer>
              <Image src={'/assets/header/cart.svg'} alt="cart" width={30} height={30} />
              {cartItemCount > 0 && <CartCountBadge>{cartItemCount}</CartCountBadge>}
            </CartIconContainer>
          </Link>

          <Logo
            onClick={() => {
              if (isLoggedIn) {
                handleLogout();
              } else {
                setShowLoginPopup(true);
              }
            }}
          >
            <Image src={'/assets/header/man.png'} alt="profile" width={40} height={40}></Image>
          </Logo>
          <Logosmall
            onClick={() => {
              if (isLoggedIn) {
                handleLogout();
              } else {
                setShowLoginPopup(true);
              }
            }}
          >
            <Image src={'/assets/header/man.png'} alt="profile" width={30} height={30}></Image>
          </Logosmall>
          <Int>Personal counselling interview: </Int>
          <Tel>+49 (0) 711 217 268 20</Tel>
          {isLoggedIn ? (
            <Request onClick={() => alert('Individual Request Action')}>Individual request</Request>
          ) : (
            <Request onClick={() => setShowLoginPopup(true)}>Login</Request>
          )}
        </Contact>
      </Styledhead>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegisterPopup}
        />
      )}
      {showRegisterPopup && (
        <RegisterPopup
          onClose={() => setShowRegisterPopup(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
};

export default Header;
