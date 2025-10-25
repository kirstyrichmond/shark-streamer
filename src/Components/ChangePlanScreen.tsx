import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
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

  const changePlan = async (planId: string): Promise<void> => {
    if (planId === user?.subscription_plan) return;
    
    setLoading(true);
      if (user) {
        await dispatch(updateSubscription({ 
          userId: user.id, 
          planId 
        } as ChangePlanParams)).unwrap();
        setLoading(false);
      }
  };

  return (
    <Container>
      <ScreenContainer>
        <HeaderContainer>
          <BackButton onClick={() => navigate(RoutePaths.Account)}>
            <BackButtonIcon />
          </BackButton>
          <Title>Change Streaming Plan</Title>
        </HeaderContainer>
        {user?.subscription_plan && (
          <CurrentPlan>
            Current Plan: <strong>
              {user.subscription_plan.charAt(0).toUpperCase() + 
               user.subscription_plan.slice(1)}
            </strong>
          </CurrentPlan>
        )}
        
        {plans.loading ? (
          <p>Loading plans...</p>
        ) : plans.error ? (
          <p>Error loading plans: {plans.error}</p>
        ) : (
          plans.items.map((plan) => {
            const isCurrentPlan = plan.id === user?.subscription_plan;

            return (
              <PlanContainer key={plan.id}>
                <PlanTitle>{plan.name}</PlanTitle>
                <PlanDescription>{plan.description}</PlanDescription>
                <PlanActions>
                  <PlanPrice>{plan.price}</PlanPrice>
                  <SubscribeButton
                    onClick={() => changePlan(plan.id)}
                    disabled={isCurrentPlan || loading}
                    style={{
                      opacity: isCurrentPlan || loading ? 0.6 : 1,
                      cursor: isCurrentPlan || loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isCurrentPlan ? "Current Plan" : loading ? "Updating..." : "Select Plan"}
                  </SubscribeButton>
                </PlanActions>
              </PlanContainer>
            );
          })
        )}
      </ScreenContainer>
    </Container>
  );
};
