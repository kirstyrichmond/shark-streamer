import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser, showSignIn, selectSelectedProfile, setSelectedProfile } from "../features/userSlice";
import { useSearch } from "../context/SearchContext";
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
import { RoutePaths } from "../router/types";

export const Nav = () => {
  const user = useSelector(selectUser);
  const selectedProfile = useSelector(selectSelectedProfile);
  const dispatch = useDispatch();
  const [show, handleShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const isHomeScreen = window.location.pathname === RoutePaths.Home;
  
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
    if (user?.profiles?.length > 0 && !selectedProfile) {
      const currentProfile = user.profiles.find((profile) => {
        return profile.activeProfile === true;
      });
      
      if (!currentProfile && user.profiles.length === 1) {
        dispatch(setSelectedProfile(user.profiles[0]));
      } else if (currentProfile) {
        dispatch(setSelectedProfile(currentProfile));
      }
    }
  }, [user?.profiles, selectedProfile, dispatch]);

  const handleSearchIconClick = () => {
    toggleSearchBar(true);
  };

  const handleSearchCancel = () => {
    toggleSearchBar(false);
  };

  return (
    <Container style={{ backgroundColor: (show || !isHomeScreen) ? "#111" : "" }}>
      <NavLogo
        src={NetflixLogo}
        alt="netflix logo"
        onClick={() => {
          toggleSearchBar(false);
          setShowMenu(false);
          navigate(RoutePaths.Home);
        }}
      />
      <RightContainer>
        {!user.info ? (
          <SignInButton onClick={() => dispatch(showSignIn())}>
            Sign In
          </SignInButton>
        ) : (
          <>
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
            {selectedProfile && (
              <>
                <NavAvatar
                  src={selectedProfile.avatar_url || "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"}
                  alt="profile avatar"
                  onClick={() => setShowMenu(!showMenu)}
                />
                <ProfileName>{selectedProfile.name}</ProfileName>
              </>
            )}
            <DropdownMenu 
              isclosed={showMenu ? "false" : "true"}
            >
              {user.profiles?.map((profile, index) => {
                return (
                  <DropdownMenuUser
                    key={index}
                    onClick={() => {
                      setShowMenu(!showMenu);
                      dispatch(setSelectedProfile(profile))
                    }}
                  >
                    <DropdownMenuAvatar
                      src={profile.avatar_url}
                      alt="profile"
                    />
                    <DropdownMenuUsername>{profile.name}</DropdownMenuUsername>
                  </DropdownMenuUser>
                );
              })}
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate(RoutePaths.Profiles);
                }}
              >
                {user.profiles?.length ? "Switch Profiles" : "Add Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowMenu(!showMenu);
                  navigate(RoutePaths.Account);
                }}
              >
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  setShowMenu(!showMenu);
                  dispatch(logoutUser());
                  navigate(RoutePaths.Home);
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
