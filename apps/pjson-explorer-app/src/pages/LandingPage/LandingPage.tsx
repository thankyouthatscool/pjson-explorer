import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import DoneOutlineTwoToneIcon from "@mui/icons-material/DoneOutlineTwoTone";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setJsonString,
  setLandingPageStatus,
  setRepositoryUrl,
  setSource,
  Source,
  SourceItems,
} from "../../store";
import { StyledForm } from "./Styled";

export const LandingPage = () => {
  const dispatch = useAppDispatch();

  const { source } = useAppSelector(({ app }) => app);

  return (
    <>
      <div>
        <Box style={{ marginBottom: "1rem" }}>
          <FormControl>
            <InputLabel id="source">Source</InputLabel>
            <Select
              defaultValue="repo_url"
              label="Source"
              labelId="source"
              onChange={(e) => {
                const selectedSource = e.target.value as SourceItems;

                dispatch(setSource(selectedSource));
              }}
            >
              {(Object.keys(Source) as (keyof typeof Source)[]).map((key) => {
                return (
                  <MenuItem key={key} value={key}>
                    {key === "package_json" ? (
                      <code>{Source[key]}</code>
                    ) : (
                      Source[key]
                    )}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        {source === "package_json" ? <JsonStringForm /> : <RepositoryUrlForm />}
      </div>
    </>
  );
};

export const JsonStringForm = () => {
  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TextField
        multiline
        placeholder="Paste content of package.json here..."
        rows={20}
        sx={{ minWidth: 750 }}
      />
      <IconButton color="success" type="submit">
        <DoneOutlineTwoToneIcon />
      </IconButton>
    </StyledForm>
  );
};

type RepositoryUrlFormInputs = { repositoryUrl: string | undefined };

export const RepositoryUrlForm = () => {
  const dispatch = useAppDispatch();

  const { repositoryUrl } = useAppSelector(({ app }) => app);

  const [repoUrlText, setRepoUrlText] = useState<typeof repositoryUrl>("");

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<RepositoryUrlFormInputs>();

  const onSubmit: SubmitHandler<RepositoryUrlFormInputs> = (data) => {
    dispatch(setLandingPageStatus(false));
    dispatch(setRepositoryUrl(data.repositoryUrl));
  };

  useEffect(() => {
    setRepoUrlText(() => repositoryUrl);
    setValue("repositoryUrl", repositoryUrl);
  }, [repositoryUrl]);

  return (
    <div>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.repositoryUrl}
          helperText={
            !!errors.repositoryUrl && (
              <span style={{ position: "absolute" }}>
                Repository URL required
              </span>
            )
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!repoUrlText}
                  onClick={() => {
                    reset();

                    dispatch(setRepositoryUrl(undefined));
                    setRepoUrlText(() => "");
                  }}
                >
                  <CancelTwoToneIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          label="Repository URL"
          placeholder="Please enter a repo URL"
          sx={{ minWidth: 750 }}
          {...register("repositoryUrl", {
            onChange: (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setRepoUrlText(() => e.target.value);
            },
            required: true,
          })}
          type="url"
        />
        <IconButton color="success" disabled={!repoUrlText} type="submit">
          <DoneOutlineTwoToneIcon />
        </IconButton>
      </StyledForm>
    </div>
  );
};
