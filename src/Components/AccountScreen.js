import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import {
  AccountContainer,
  BottomContainer,
  CancelMembershipButton,
  ChangePlanButtonLink,
  ChangePlanContainer,
  Container,
  EmailText,
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

export const AccountScreen = () => {
  const user = useSelector(selectUser);

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
            <CancelMembershipButton>Cancel Membership</CancelMembershipButton>
          </MembershipHeader>
          <div>
            <EmailText>{user.info.email}</EmailText>
          </div>
        </MiddleContainer>
        <BottomContainer>
          <PlanHeader>
            <PlanTitle>PLAN DETAILS</PlanTitle>
          </PlanHeader>
          <ChangePlanContainer>
            <PlanTypeContainer>
              <PlanTypeTitle>Standard</PlanTypeTitle>
              <HdIcon
                src="https://img.icons8.com/ios/100/000000/hd.png"
                alt="hd icon"
              />
            </PlanTypeContainer>
            <div>
              <ChangePlanButtonLink to="/change-plan">
                Change Plan
              </ChangePlanButtonLink>
            </div>
          </ChangePlanContainer>
        </BottomContainer>
        <SignOutButton onClick={() => auth.signOut()}>Sign Out</SignOutButton>
      </AccountContainer>
    </Container>
  );
};
