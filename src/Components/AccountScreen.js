import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, logoutUser } from "../features/userSlice";
import {
  AccountContainer,
  BottomContainer,
  CancelMembershipButton,
  ChangePlanButtonLink,
  ChangePlanContainer,
  Container,
  EmailText,
  EmailContainer,
  HdIcon,
  MemberIcon,
  MembershipHeader,
  MembershipTitle,
  MemberSinceText,
  MiddleContainer,
  PlanHeader,
  PlanTitle,
  PlanTypeContainer,
  PlanTypeTitle,
  SignOutButton,
  Title,
  TopContainer,
  TopInnerContainer,
} from "../styles/AccountScreen.styles";
import { RoutePaths } from "../router/types";

export const AccountScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPlan = user.info?.subscription_plan || 'basic';
  const planDisplayName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  const showHdIcon = currentPlan === 'standard' || currentPlan === 'premium';

  const handleSignOut = async () => {
    dispatch(logoutUser());
    navigate(RoutePaths.Home);
  };

  return (
    <Container>
      <AccountContainer>
        <TopContainer>
          <Title>Account</Title>
          <TopInnerContainer>
            <MemberIcon
              src="https://assets.nflxext.com/ffe/siteui/account/svg/membersince.svg"
              alt="member icon"
            />
            <MemberSinceText>Member Since September 2022</MemberSinceText>
          </TopInnerContainer>
        </TopContainer>
        <MiddleContainer>
          <MembershipHeader>
            <MembershipTitle>MEMBERSHIP & BILLING</MembershipTitle>
          </MembershipHeader>
          <EmailContainer>
            <EmailText>{user.info.email}</EmailText>
          </EmailContainer>
        </MiddleContainer>
        <BottomContainer>
          <PlanHeader>
            <PlanTitle>PLAN DETAILS</PlanTitle>
          </PlanHeader>
          <ChangePlanContainer>
            <PlanTypeContainer>
              <PlanTypeTitle>{planDisplayName}</PlanTypeTitle>
              {showHdIcon && (
                <HdIcon
                  src="https://img.icons8.com/ios/100/000000/hd.png"
                  alt="hd icon"
                />
              )}
            </PlanTypeContainer>
            <div>
              <ChangePlanButtonLink to="/change-plan">
                Change Plan
              </ChangePlanButtonLink>
            </div>
          </ChangePlanContainer>
        </BottomContainer>
        <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        <CancelMembershipButton>Cancel Membership</CancelMembershipButton>
      </AccountContainer>
    </Container>
  );
};
