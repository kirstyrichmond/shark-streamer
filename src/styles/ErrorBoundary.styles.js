import styled from 'styled-components';

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
  text-align: center;
  margin: 1rem 0;
`;

export const ErrorTitle = styled.h3`
  color: #e50914;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

export const ErrorMessage = styled.p`
  margin-bottom: 1rem;
  color: #ccc;
  line-height: 1.4;
`;

export const RetryButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f40612;
  }
`;