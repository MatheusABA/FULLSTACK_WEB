import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/mediaApi";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/uiConfig";

const mediaTypes = ["movie"];
let timer;
const timeout = 500;

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  const search = useCallback(
    async () => {
      setOnSearch(true);

      const { response, err } = await mediaApi.search({
        mediaType,
        query,
        page
      });

      setOnSearch(false);

      if (err) toast.error(err.message);
      if (response) {
        if (page > 1) setMedias(m => [...m, ...response.results]);
        else setMedias([...response.results]);
      }
    },
    [mediaType, query, page],
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
    } else search();
  }, [search, query, mediaType, page]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuery(newQuery);
    }, timeout);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>
          <TextField
            color="success"
            placeholder="Pesquisar..."
            sx={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          <MediaGrid medias={medias} mediaType={mediaType} />

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              onClick={() => setPage(page + 1)}
            >
              Ver mais...
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;