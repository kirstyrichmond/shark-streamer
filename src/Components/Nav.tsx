import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUser,
  logoutUser,
  showSignIn,
  selectSelectedProfile,
  setSelectedProfile,
} from "../store/slices/userSlice";
import { useSearch } from "../hooks/useSearch";
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
  ProfileName,
  RightContainer,
  SearchIcon,
  SignInButton,
} from "../styles/Nav.styles";
import { RoutePaths } from "../router/types";
import { useAppDispatch } from "../app/store";

export const Nav = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const selectedProfile = useSelector(selectSelectedProfile);

  const [show, handleShow] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [scrollOpacity, setScrollOpacity] = useState<number>(0);
  const isHomeScreen = window.location.pathname === RoutePaths.Home;

  const { searchKey, setSearchKey, showSearchBar, toggleSearchBar, handleSearchSubmit } =
    useSearch();

  const transitionNavBar = () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      handleShow(true);
      setScrollOpacity(1);
    } else {
      handleShow(false);
      const opacity = Math.min(scrollY / 100, 1);
      setScrollOpacity(opacity);
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

  const getBackgroundStyle = () => {
    if (!isHomeScreen || show) return { backgroundColor: "#111" };
    return {
      background: `linear-gradient(to bottom, rgba(0, 0, 0, ${0.8 + scrollOpacity * 0.9}) 0%, rgba(0, 0, 0, ${scrollOpacity * 0.1}) 100%)`,
    };
  };

  return (
    <Container style={ getBackgroundStyle() }>
      <div
        onClick={ () => {
          toggleSearchBar(false);
          setShowMenu(false);
          navigate(RoutePaths.Home);
        } }
        style={ {
          fontFamily: "Boogaloo",
          fontSize: "28px",
          color: "#00acee",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "1px",
          cursor: "pointer",
        } }
      >
        Shark Streamer
      </div>
      <RightContainer>
        { !user ? (
          <SignInButton onClick={ () => dispatch(showSignIn()) }>Sign In</SignInButton>
        ) : (
          <>
            <div>
              { showSearchBar ? (
                <Form onSubmit={ handleSearchSubmit }>
                  <InputContainer>
                    <Input
                      autoFocus
                      type="text"
                      value={ searchKey }
                      placeholder="Titles, people, genres"
                      onChange={ (e) => setSearchKey(e.target.value) }
                      onKeyDown={ (e) => {
                        if (e.key === "Enter") {
                          handleSearchSubmit(e);
                        }
                      } }
                    />
                    <CancelButton onClick={ handleSearchCancel } type="button">
                      X
                    </CancelButton>
                  </InputContainer>
                </Form>
              ) : (
                <SearchIcon
                  src="https://img.icons8.com/sf-regular/48/FFFFFF/search.png"
                  alt="search icon"
                  onClick={ handleSearchIconClick }
                />
              ) }
            </div>
            { selectedProfile && (
              <>
                <NavAvatar
                  src={
                    selectedProfile.avatar_url ||
                    "https://occ-0-300-1167.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY5cwIbM7shRfcXmfQg98cqMqiZZ8sReZnj4y_keCAHeXmG_SoqLD8SXYistPtesdqIjcsGE-tHO8RR92n7NyxZpqcFS80YfbRFz.png?r=229"
                  }
                  alt="profile avatar"
                  onClick={ () => setShowMenu(!showMenu) }
                />
                <ProfileName>{ selectedProfile.name }</ProfileName>
              </>
            ) }
            <DropdownMenu isclosed={ showMenu ? "false" : "true" }>
              { user.profiles?.map((profile, index) => {
                return (
                  <DropdownMenuUser
                    key={ index }
                    onClick={ () => {
                      setShowMenu(!showMenu);
                      dispatch(setSelectedProfile(profile));
                    } }
                  >
                    <DropdownMenuAvatar src={ profile.avatar_url } alt="profile" />
                    <DropdownMenuUsername>{ profile.name }</DropdownMenuUsername>
                  </DropdownMenuUser>
                );
              }) }
              <DropdownMenuItem
                onClick={ () => {
                  setShowMenu(!showMenu);
                  navigate(RoutePaths.Profiles);
                } }
              >
                { user.profiles?.length ? "Switch Profiles" : "Add Profile" }
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={ () => {
                  setShowMenu(!showMenu);
                  navigate(RoutePaths.Account);
                } }
              >
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={ async () => {
                  setShowMenu(!showMenu);
                  dispatch(logoutUser());
                  navigate(RoutePaths.Home);
                } }
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenu>
          </>
        ) }
      </RightContainer>
    </Container>
  );
};
