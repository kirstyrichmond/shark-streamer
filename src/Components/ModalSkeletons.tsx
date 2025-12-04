import Skeleton from "react-loading-skeleton";
import {
  MovieInfo,
  MovieInfoContainer,
  MovieMetaRow,
  SimilarSection,
  SimilarTitle,
  SimilarGrid,
  SimilarCard,
  SimilarCardTitle,
  SimilarCardDuration,
  TrailersSection,
  TrailerGrid,
  TrailerCard,
  TrailerTitle,
  TrailerDuration,
} from "../styles/MovieModal.styles";

export const ModalHeaderSkeleton = () => (
  <div>
    <Skeleton height={ 400 } baseColor="#202020" highlightColor="#444" borderRadius={ 8 } />
  </div>
);

export const ModalContentSkeleton = () => (
  <MovieInfo>
    <MovieInfoContainer style={ { width: "100% " } }>
      <MovieMetaRow>
        <div style={ { width: "100%" } }>
          <div style={ { display: "flex", gap: "15px", marginBottom: "20px", width: "100%" } }>
            <Skeleton width={ 80 } height={ 24 } baseColor="#202020" highlightColor="#444" borderRadius={ 12 } />
            <Skeleton width={ 60 } height={ 24 } baseColor="#202020" highlightColor="#444" borderRadius={ 12 } />
            <Skeleton width={ 90 } height={ 24 } baseColor="#202020" highlightColor="#444" borderRadius={ 12 } />
          </div>
          <div style={ { marginBottom: "20px", width: "100%", display: "grid", gridTemplateColumns: "4fr 1fr" } }>
            <div style={ { marginRight: "20px" } }>
              <Skeleton
                count={ 4 }
                height={ 18 }
                baseColor="#202020"
                highlightColor="#444"
                style={ { marginBottom: "6px" } }
              />
              <Skeleton width={ "60%" } height={ 18 } baseColor="#202020" highlightColor="#444" />
            </div>
            <div>
              <Skeleton
                count={ 4 }
                height={ 18 }
                baseColor="#202020"
                highlightColor="#444"
                style={ { marginBottom: "6px" } }
              />
            </div>
          </div>
        </div>
      </MovieMetaRow>
      <SimilarSection>
        <SimilarTitle>More Like This</SimilarTitle>
        <SimilarGrid>
          { Array.from({ length: 6 }).map((_, index) => (
            <SimilarCard key={ `skeleton-${index}` }>
              <Skeleton height={ 150 } baseColor="#202020" highlightColor="#444" borderRadius={ 8 } />
              <SimilarCardTitle>
                <Skeleton width={ 120 } height={ 16 } baseColor="#202020" highlightColor="#444" />
              </SimilarCardTitle>
              <SimilarCardDuration>
                <Skeleton width={ 60 } height={ 14 } baseColor="#202020" highlightColor="#444" />
              </SimilarCardDuration>
            </SimilarCard>
          )) }
        </SimilarGrid>
      </SimilarSection>
      <TrailersSection>
        <SimilarTitle>Trailers & More</SimilarTitle>
        <TrailerGrid>
          { Array.from({ length: 4 }).map((_, index) => (
            <TrailerCard key={ `trailer-skeleton-${index}` }>
              <Skeleton height={ 120 } baseColor="#202020" highlightColor="#444" borderRadius={ 8 } />
              <TrailerTitle>
                <Skeleton width={ 140 } height={ 16 } baseColor="#202020" highlightColor="#444" />
              </TrailerTitle>
              <TrailerDuration>
                <Skeleton width={ 50 } height={ 14 } baseColor="#202020" highlightColor="#444" />
              </TrailerDuration>
            </TrailerCard>
          )) }
        </TrailerGrid>
      </TrailersSection>
    </MovieInfoContainer>
  </MovieInfo>
);
