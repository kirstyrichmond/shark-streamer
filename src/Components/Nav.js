import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import {
  CancelButton,
  Container,
  DropdownMenu,
  DropdownMenuAvatar,
  DropdownMenuItem,
  DropdownMenuUser,
  DropdownMenuUsername,
  Form,
  Input,
  InputContainer,
  NavAvatar,
  NavLogo,
  ProfileName,
  RightContainer,
  SearchIcon,
  SignInButton,
} from "../styles/Nav.styles";
import NetflixLogo from "../Images/netflix-logo.png"

export const Nav = ({
  showSearchBar,
  setShowSearchBar,
  searchKey,
  setSearchKey,
  searchMovies,
  setShowSignInScreen,
  showSignInScreen,
  setShowSignUpScreen,
}) => {
  const { innerWidth: screenWidth } = window;
  const user = useSelector(selectUser);
  const [show, handleShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeProfile, setActiveProfile] = useState(
    user.profiles.some((profile) => {
      return profile.activeProfile === true;
    }) ?? {}
  );
  const navigate = useNavigate();
  const isHomeScreen = window.location.pathname === "/";

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);

    return () => window.removeEventListener("scroll", transitionNavBar);
  });

  useEffect(() => {
    const currentProfile = user.profiles.find((profile) => {
      return profile.activeProfile === true;
    });
    setActiveProfile(currentProfile);
  }, [user.profiles]);

  return (
    <Container black={show || !isHomeScreen}>
      <NavLogo
        src={ NetflixLogo }
        alt="netflix logo"
        onClick={() => {
          setShowSearchBar(false);
          setSearchKey("");
          setShowMenu(false);
          navigate("/");

          if (user.info === null) {
            setShowSignUpScreen(false);
            setShowSignInScreen(false);
          }
        }}
      />
      <RightContainer>
        {!user.info ? (
          <SignInButton
            onClick={() => {
              setShowSignUpScreen(false);
              setShowSignInScreen(true);
            }}
          >
            Sign In
          </SignInButton>
        ) : (
          <>
            {screenWidth > 390 && (
              <div>
                {showSearchBar ? (
                  <Form onSubmit={searchMovies}>
                    <InputContainer>
                      <Input
                        autoFocus
                        type="text"
                        onBlur={() => {
                          !searchKey && setShowSearchBar(false);
                        }}
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                      {searchKey && (
                        <CancelButton
                          onClick={() => {
                            setSearchKey("");
                            setShowSearchBar(false);
                          }}
                        >
                          X
                        </CancelButton>
                      )}
                    </InputContainer>
                  </Form>
                ) : (
                  <SearchIcon
                    src="https://img.icons8.com/sf-regular/48/FFFFFF/search.png"
                    alt=""
                    onClick={() => setShowSearchBar(true)}
                  />
                )}
              </div>
            )}
            <NavAvatar
              src="https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg"
              alt="netflix avatar"
              onClick={() => setShowMenu(!showMenu)}
            />{" "}
            <ProfileName>{activeProfile?.name ?? null}</ProfileName>
            <DropdownMenu closed={!showMenu}>
              {user.profiles?.map((profile) => {
                return (
                  <DropdownMenuUser
                    onClick={() => {
                      setShowMenu(!showMenu);
                      navigate("/profiles");
                    }}
                    component="button"
                  >
                    <DropdownMenuAvatar
                      src="https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
                      alt="profile"
                    />
                    <DropdownMenuUsername>{profile.name}</DropdownMenuUsername>
                  </DropdownMenuUser>
                );
              })}
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate("/profiles");
                }}
                component="button"
              >
                {user.profiles.length ? "Switch Profiles" : "Add Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate("/account");
                }}
                component="button"
              >
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate("/");
                  auth.signOut();
                }}
                component="button"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenu>
          </>
        )}
      </RightContainer>
    </Container>
  );
};
