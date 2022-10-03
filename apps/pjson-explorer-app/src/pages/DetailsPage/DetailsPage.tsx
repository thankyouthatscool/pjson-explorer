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

enum LoadingMessages {
  default_branch = "Getting repo's default branch",
  default_branch_sha = "Getting default branch's SHA",
  tree = "Getting repo tree",
  file_list_filter = "Filtering file list",
  done = "done",
}

const ACCESS_TOKEN = "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";
const DEFAULT_GITHUB_BRANCH = "master";
const REQUEST_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

export const DetailsPage = () => {
  const [dependencies, setDependencies] = useState<Dependencies[]>([]);
  const [devDependencies, setDevDependencies] = useState<Dependencies[]>([]);
  const [loadingMessage, setLoadingMessage] =
    useState<keyof typeof LoadingMessages>("default_branch");
  const [repoInformation, setRepoInformation] = useState<
    RepoInformation | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const { repositoryUrl } = useAppSelector(({ app }) => app);

  const fetchRepoInfo = useCallback(
    async (repoOwner: string, repoName: string) => {
      // 1. Get repo's default branch.
      const defaultBranchRes = await axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}`,
        {
          headers: REQUEST_HEADERS,
        }
      );

      const defaultBranch: string = defaultBranchRes.data.default_branch;

      // 2. Get DEFAULT_BRANCH tree sha.

      setLoadingMessage(() => "default_branch_sha");

      const treeShaUrlRes = await axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}/branches/${defaultBranch}`,
        {
          headers: REQUEST_HEADERS,
        }
      );

      const commitShaUrlResponse = treeShaUrlRes.data.commit.commit.tree.url;

      // 3. Get tree

      setLoadingMessage(() => "tree");

      const repoFileListRes = await axios.get(
        `${commitShaUrlResponse}?recursive=true`,
        {
          headers: REQUEST_HEADERS,
        }
      );

      const packageJsonFileList = repoFileListRes.data.tree.filter(
        (file: { path: string }) => file.path.includes("package.json")
      );

      const funkyMap: string[] = packageJsonFileList.map(
        (file: { path: string }) => file.path
      );

      setLoadingMessage(() => "file_list_filter");

      const allPromises = await Promise.all(
        funkyMap.map(async (filePath) => {
          const fileContentRes = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
              headers: REQUEST_HEADERS,
            }
          );

          const jsonFileContent: {
            dependencies: { [key: string]: string };
            devDependencies: { [key: string]: string };
          } = JSON.parse(atob(fileContentRes.data.content));

          return {
            dependencies: jsonFileContent.dependencies,
            devDependencies: jsonFileContent.devDependencies,
          };
        })
      );

      const allDependencies = allPromises.reduce((acc, val) => {
        let dependencyEntries: [string, string][];

        try {
          dependencyEntries = Object.entries(val.dependencies);
        } catch {
          dependencyEntries = [];
        }

        return [
          ...acc,
          ...dependencyEntries.map((dep) => {
            return { [dep[0]]: dep[1] };
          }),
        ];
      }, [] as { [key: string]: string }[]);

      setDependencies(() => allDependencies);

      const allDevDependencies = allPromises.reduce((acc, val) => {
        let dependencyEntries: [string, string][];

        try {
          dependencyEntries = Object.entries(val.devDependencies);
        } catch {
          dependencyEntries = [];
        }

        return [
          ...acc,
          ...dependencyEntries.map((dep) => {
            return { [dep[0]]: dep[1] };
          }),
        ];
      }, [] as { [key: string]: string }[]);

      setDevDependencies(() => allDevDependencies);

      setLoadingMessage(() => "done");
    },

    [repoInformation]
  );

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
      fetchRepoInfo(repoInformation.owner, repoInformation.repoName);
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
      <pre>
        {JSON.stringify(
          {
            repositoryUrl,
            repoInformation,
            loadingMessage,
            dependencies,
            devDependencies,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

// https://raw.githubusercontent.com/total-typescript/typescript-generics-workshop/main/package.json
// https://github.com/total-typescript/typescript-generics-workshop
// https://github.com/total-typescript/typescript-generics-workshop.git
