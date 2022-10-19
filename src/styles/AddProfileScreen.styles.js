import styled from "styled-components";

export const AddProfileContainer = styled.div`
  width: 75%;
  height: 100vh;
  margin: auto;
  padding-top: 300px;
  z-index: 1;
  max-width: 700px;
`;

export const AddProfileHeader = styled.div`
  border-bottom: 1px solid #666;
  padding-bottom: 28px;
  margin-bottom: 28px;
`;

export const AddProfileTitle = styled.h1`
  color: #fff;
  font-size: 4.5rem;
  font-weight: 500;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  color: #666;
  font-size: 1.8rem;
  font-weight: 400;
`;

export const Input = styled.input`
  width: 100%;
  height: 50px;
  font-size: 1.8rem;
  background: #666;
  color: #fff;
  padding-left: 18px;
  font-weight: 500;
  outline: none;
  letter-spacing: 1px;
`;

export const InputContainer = styled.div`
  border-bottom: 1px solid #666;
  padding-bottom: 38px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
`;

export const ContinueButton = styled.button`
  background: #fff;
  color: #191919;
  width: 200px;
  height: 60px;
  font-size: 1.6rem;
  font-weight: 700;
  margin-right: 50px;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #666;
  width: 200px;
  height: 60px;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
`;

export const AvatarImg = styled.img`
  width: 160px;
  margin-right: 50px;
  border-radius: 8px;
`;
