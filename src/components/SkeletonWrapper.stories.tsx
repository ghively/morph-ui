import { SkeletonWrapper } from "./SkeletonWrapper";

const content = (
  <div style={{ lineHeight: 1.6 }}>
    <h4 style={{ margin: "0 0 0.5rem" }}>Deploy summary</h4>
    <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>
      3 tasks changed, 0 failed. Committed as 6fa5599 and pushed to origin/main.
    </p>
  </div>
);

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 420 }}>
    <SkeletonWrapper>{content}</SkeletonWrapper>
  </div>
);

export const Loading = () => (
  <div style={{ padding: "2rem", maxWidth: 420 }}>
    <SkeletonWrapper isLoading style={{ borderRadius: 12 }}>
      {content}
    </SkeletonWrapper>
  </div>
);
