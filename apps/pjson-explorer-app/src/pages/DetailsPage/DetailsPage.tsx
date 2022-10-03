import { Button } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { setLandingPageStatus } from "../../store";

interface RepoInformation {
  owner: string;
  repoName: string;
}

interface Dependencies {
  [key: string]: string;
}

const DEFAULT_GITHUB_BRANCH = "master";

export const DetailsPage = () => {
  const [dependencies, setDependencies] = useState<Dependencies[]>([]);
  const [devDependencies, setDevDependencies] = useState<Dependencies[]>([]);
  const [repoInformation, setRepoInformation] = useState<
    RepoInformation | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const { repositoryUrl } = useAppSelector(({ app }) => app);

  const fetchRepoInfo = useCallback(async () => {
    const res = await axios.get(
      `https://raw.githubusercontent.com/${repoInformation?.owner}/${repoInformation?.repoName}/${DEFAULT_GITHUB_BRANCH}/package.json`
    );

    const dependencies = res.data.dependencies;
    const devDependencies = res.data.devDependencies;

    setDependencies(() => dependencies);
    setDevDependencies(() => devDependencies);
  }, [repoInformation]);

  useEffect(() => {
    if (repositoryUrl) {
      const [owner, repoName] = repositoryUrl.split("/").slice(-2);

      if (repoName.endsWith(".git")) {
        const simpleRepoName = repoName.split("").slice(0, -4).join("");

        return setRepoInformation(() => ({ owner, repoName: simpleRepoName }));
      }

      setRepoInformation(() => ({ owner, repoName }));
    }
  }, [repositoryUrl]);

  useEffect(() => {
    if (repoInformation) {
      fetchRepoInfo();
    }
  }, [repoInformation]);

  return (
    <div>
      <div>DetailsPage</div>
      <Button
        onClick={() => {
          dispatch(setLandingPageStatus(true));
        }}
      >
        Back
      </Button>
      <Button
        onClick={async () => {
          const res = await axios.get(
            `https://raw.githubusercontent.com/${repoInformation?.owner}/${repoInformation?.repoName}/${DEFAULT_GITHUB_BRANCH}/package.json`
          );

          console.log(res.data.dependencies);
          console.log(res.data.devDependencies);
        }}
      >
        Look
      </Button>
      <pre>{JSON.stringify({ repositoryUrl, repoInformation }, null, 2)}</pre>
    </div>
  );
};

// https://raw.githubusercontent.com/total-typescript/typescript-generics-workshop/main/package.json
// https://github.com/total-typescript/typescript-generics-workshop
// https://github.com/total-typescript/typescript-generics-workshop.git
