import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { useSearch } from "../context/SearchContext"; // Import the search context hook
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
import NetflixLogo from "../Images/netflix-logo.png";

export const Nav = ({ setShowSignInScreen, setShowSignUpScreen }) => {
  const { innerWidth: screenWidth } = window;
  const user = useSelector(selectUser);
  const [show, handleShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const navigate = useNavigate();
  const isHomeScreen = window.location.pathname === "/";
  
  // Use the search context
  const { 
    searchKey, 
    setSearchKey, 
    showSearchBar, 
    toggleSearchBar,
    handleSearchSubmit 
  } = useSearch();

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
  }, []);

  useEffect(() => {
    if (user?.profiles?.length > 0) {
      const currentProfile = user.profiles.find((profile) => {
        return profile.activeProfile === true;
      });
      setActiveProfile(currentProfile);
    }
  }, [user?.profiles]);

  const handleSearchIconClick = () => {
    console.log("Search icon clicked");
    toggleSearchBar(true);
  };

  const handleSearchCancel = () => {
    console.log("Search canceled");
    toggleSearchBar(false);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    
    setShowSignUpScreen(false);
    setShowSignInScreen(true);
  };

  return (
    <Container style={{ backgroundColor: (show || !isHomeScreen) ? "#111" : "" }}>
      <NavLogo
        src={NetflixLogo}
        alt="netflix logo"
        onClick={() => {
          toggleSearchBar(false);
          setShowMenu(false);
          navigate("/");

          if (!user.info) {
            setShowSignUpScreen(false);
            setShowSignInScreen(false);
          }
        }}
      />
      <RightContainer>
        {!user.info ? (
          <SignInButton onClick={handleSignInClick}>
            Sign In
          </SignInButton>
        ) : (
          <>
            {screenWidth > 390 && (
              <div>
                {showSearchBar ? (
                  <Form onSubmit={handleSearchSubmit}>
                    <InputContainer>
                      <Input
                        autoFocus
                        type="text"
                        value={searchKey}
                        placeholder="Titles, people, genres"
                        onChange={(e) => setSearchKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchSubmit(e);
                          }
                        }}
                      />
                      <CancelButton
                        onClick={handleSearchCancel}
                        type="button"
                      >
                        X
                      </CancelButton>
                    </InputContainer>
                  </Form>
                ) : (
                  <SearchIcon
                    src="https://img.icons8.com/sf-regular/48/FFFFFF/search.png"
                    alt="search icon"
                    onClick={handleSearchIconClick}
                  />
                )}
              </div>
            )}
            <NavAvatar
              src="https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg"
              alt="netflix avatar"
              onClick={() => setShowMenu(!showMenu)}
            />
            <ProfileName>{activeProfile?.name ?? null}</ProfileName>
            <DropdownMenu 
              isclosed={showMenu ? "false" : "true"}
            >
              {user.profiles?.map((profile, index) => {
                return (
                  <DropdownMenuUser
                    key={index}
                    onClick={() => {
                      setShowMenu(!showMenu);
                      setActiveProfile(profile);
                    }}
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
              >
                {user.profiles?.length ? "Switch Profiles" : "Add Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate("/account");
                }}
              >
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate("/");
                  auth.signOut();
                }}
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
