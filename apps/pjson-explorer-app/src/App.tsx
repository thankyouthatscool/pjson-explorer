import { useAppSelector } from "./hooks";
import { DetailsPage, LandingPage } from "./pages";
import { RootWrapper } from "./Styled";

export const App = () => {
  const { isLandingPageActive } = useAppSelector(({ app }) => app);

  return (
    <RootWrapper>
      {isLandingPageActive ? <LandingPage /> : <DetailsPage />}
    </RootWrapper>
  );
};
