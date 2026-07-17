import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, selectPlans, fetchPlans, updateSubscription } from "../store/slices/userSlice";
import {
  BackButton,
  BackButtonIcon,
  Container,
  CurrentPlan,
  HeaderContainer,
  PlanActions,
  PlanContainer,
  PlanDescription,
  PlanPrice,
  PlanTitle,
  ScreenContainer,
  SubscribeButton,
  Title,
} from "../styles/ChangePlan.styles";
import { RoutePaths } from "../router/types";
import { useAppDispatch } from "../app/store";

export const ChangePlanScreen = () => {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const plans = useSelector(selectPlans);
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (plans.items.length === 0 && !plans.loading) {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans.items.length, plans.loading]);

  interface ChangePlanParams {
    userId: string;
    planId: string;
  }

  const changePlan = useCallback(async (planId: string): Promise<void> => {
    if (planId === user?.subscription_plan || loadingPlanId) return;

    setLoadingPlanId(planId);
    if (user) {
      try {
        await dispatch(
          updateSubscription({
            userId: user.id,
            planId,
          } as ChangePlanParams)
        ).unwrap();
      } finally {
        setLoadingPlanId(null);
      }
    }
  }, [dispatch, user, loadingPlanId]);

  return (
    <Container>
      <ScreenContainer>
        <HeaderContainer>
          <BackButton onClick={ () => navigate(RoutePaths.Account) }>
            <BackButtonIcon />
          </BackButton>
          <Title>Change Streaming Plan</Title>
        </HeaderContainer>
        { user?.subscription_plan && (
          <CurrentPlan>
            Current Plan:{ " " }
            <strong>{ user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1) }</strong>
          </CurrentPlan>
        ) }

        { plans.loading ? (
          <p>Loading plans...</p>
        ) : plans.error ? (
          <p>Error loading plans: { plans.error }</p>
        ) : (
          plans.items.map((plan) => {
            const isCurrentPlan = plan.id === user?.subscription_plan;
            const isLoading = loadingPlanId === plan.id;

            return (
              <PlanContainer key={ plan.id }>
                <PlanTitle>{ plan.name }</PlanTitle>
                <PlanDescription>{ plan.description }</PlanDescription>
                <PlanActions>
                  <PlanPrice>{ plan.price }</PlanPrice>
                  <SubscribeButton
                    onClick={ () => changePlan(plan.id) }
                    disabled={ isCurrentPlan || isLoading }
                    style={ {
                      opacity: isCurrentPlan || isLoading ? 0.6 : 1,
                      cursor: isCurrentPlan || isLoading ? "not-allowed" : "pointer",
                    } }
                  >
                    { isCurrentPlan ? "Current Plan" : isLoading ? "Updating..." : "Select Plan" }
                  </SubscribeButton>
                </PlanActions>
              </PlanContainer>
            );
          })
        ) }
      </ScreenContainer>
    </Container>
  );
};
