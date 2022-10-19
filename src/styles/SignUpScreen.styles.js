import styled from "styled-components";

export const Container = styled.div``;

export const InnerContainer = styled.div`
  max-height: 400px;
  width: 100%;
  padding: 60px 68px 40px;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  color: #fff;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 28px;
`;

export const Input = styled.input`
  outline-width: 0;
  height: 50px;
  margin-bottom: 14px;
  padding: 0px 20px 0px;
  font-size: 1.2rem;
  background: #333;
  border: none;
  border-radius: 4px;
  top: 50%;
  color: #8c8c8c;
`;

export const SignUpButton = styled.button`
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 28px;
  background: #e50914;
  line-height: 1rem;
  padding: 20px;
  cursor: pointer;
  border: none;
  color: #fff;
`;

export const SignUpDescription = styled.h4`
  font-size: 20px;
  font-weight: 500;
`;

export const DescriptionSpan = styled.span`
  color: #737373;
  margin-top: 16px;
`;

export const SpanLink = styled(DescriptionSpan)`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
