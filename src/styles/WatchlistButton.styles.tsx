import styled from "styled-components";

export const WatchlistButtonContainer = styled.button<{ $isInWatchlist: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => {
    const basePadding = props.$isInWatchlist ? 0.7 : 1;
    return `${0.8 * basePadding}rem ${1.5 * basePadding}rem`;
  }};

  background-color: ${(props) => (props.$isInWatchlist ? "#333" : "rgba(255, 255, 255, 0.1)")};
  border: 2px solid ${(props) => (props.$isInWatchlist ? "#666" : "rgba(255, 255, 255, 0.7)")};
  border-radius: 4px;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isInWatchlist ? "#555" : "rgba(255, 255, 255, 0.2)")};
    border-color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: ${(props) => {
      const basePadding = props.$isInWatchlist ? 0.5 : 0.7;
      return `${0.6 * basePadding}rem ${1.2 * basePadding}rem`;
    }};

    font-size: 1rem;
  }
`;

export const WatchlistIcon = styled.div<{ $isInWatchlist: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => {
    const baseSize = props.$isInWatchlist ? 1.6 : 1;
    return `${1 * baseSize}rem`;
  }};

  @media (max-width: 768px) {
    font-size: ${(props) => {
      const baseSize = props.$isInWatchlist ? 1.3 : 0.8;
      return `${0.9 * baseSize}rem`;
    }};
  }
`;
