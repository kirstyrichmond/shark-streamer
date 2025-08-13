import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, selectPlans, fetchPlans, updateSubscription } from "../features/userSlice";
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

export const ChangePlanScreen = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const plans = useSelector(selectPlans);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (plans.items.length === 0 && !plans.loading) {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans.items.length, plans.loading]);

  const changePlan = async (planId) => {
    if (planId === user.info?.subscription_plan) return;
    
    setLoading(true);
    try {
      await dispatch(updateSubscription({ 
        userId: user.info.id, 
        planId 
      })).unwrap();
    } catch (error) {
      alert('Failed to change plan. Please try again.');
    } finally {
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
        {user.info?.subscription_plan && (
          <CurrentPlan>
            Current Plan: <strong>
              {user.info.subscription_plan.charAt(0).toUpperCase() + 
               user.info.subscription_plan.slice(1)}
            </strong>
          </CurrentPlan>
        )}
        
        {plans.loading ? (
          <p>Loading plans...</p>
        ) : plans.error ? (
          <p>Error loading plans: {plans.error}</p>
        ) : (
          plans.items.map((plan) => {
            const isCurrentPlan = plan.id === user.info?.subscription_plan;

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
