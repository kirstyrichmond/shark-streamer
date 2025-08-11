import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const ScreenContainer = styled.div`
  width: 75%;
  margin: auto;
  max-width: 700px;
  padding: 2rem 1rem;
  box-sizing: border-box;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 2rem;
`;

export const PlanContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
`;

export const PlanTitle = styled.h2``;

export const PlanDescription = styled.p``;

export const PlanPrice = styled.p``;

export const SubscribeButton = styled.button`
  height: 40px;
  background: #e50914;
  border: none;
  color: #fff;
  padding: 4px 12px;
  cursor: pointer;

  &:disabled {
    background: gray !important;
    cursor: not-allowed;
  }
`;
