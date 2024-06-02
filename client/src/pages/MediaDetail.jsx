import React, {useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelect, useSelector } from 'react-redux'
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined"
import {LoadingButton} from "@mui/lab"
import { Backdrop, Box, Button, Chip, Divided, Divider, Stack, Typography } from "@mui/material"
import {toast} from 'react-toastify'
import CircularRate from '../components/common/CircularRate'
import Container from '../components/common/Container'
import ImageHeader from '../components/common/ImageHeader'
import uiConfigs from '../configs/uiConfig'
import tmdbConfigs from '../api/configs/tmdbConfigs'
import mediaApi from '../api/modules/mediaApi'
import favoriteApi from '../api/modules/favoriteApi'
import { setGlobalLoading } from '../redux/features/globalLoadingSlice'
import {setAuthModalOpen} from '../redux/features/authModalSlice'
import { addFavorite, removeFavorite } from '../redux/features/userSlice'
import CastSlide from '../components/common/CastSlide'
import MediaVideosSlide from '../components/common/MediaVideosSlide'
import BackdropSlide from '../components/common/BackdropSlide'
import PosterSlide from '../components/common/PosterSlide'
import RecommendSlide from '../components/common/RecommendSlide'
import MediaSlide from '../components/common/MediaSlide'


const MediaDetail = () => {

    const { mediaType, mediaId } = useParams();

    const { user, listFavorites } = useSelector((state) => state.user)

    const [media, setMedia] = useState()
    const [isFavorite, setIsFavorite] = useState(false)
    const [onRequest, setOnRequest] = useState(false)
    const [genres, setGenres] = useState([])

    const dispatch = useDispatch();

    const videoRef = useRef(null);

    const onFavoriteClick = async () => {
        if (!user) return dispatch(setAuthModalOpen(true));

        if (onRequest) return 

        if(isFavorite) {
            onRemoveFavorite()
            return
        }

        setOnRequest(true)

        const body = {
            mediaId: media.id,
            mediaTitle: media.title || media.name,
            mediaType: mediaType,
            mediaPoster: media.poster_path,
            mediaRate: media.vote_average
        }

        const { response, err } = await favoriteApi.add(body)

        setOnRequest(false)

        if (err) toast.error(err.message)
        if (response) {
            dispatch(addFavorite(response))
            setIsFavorite(true)
            toast.success("Adicionado para ver depois!")
        }
    }

    const onRemoveFavorite = async () => {
        if (onRequest) return;
        setOnRequest(true);

        const favorite = listFavorites.find(e => e.mediaId.toString() === media.id.toString());

        const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });

        setOnRequest(false);

        if (err) toast.error(err.message);
        if (response) {
            dispatch(removeFavorite(favorite));
            setIsFavorite(false);
            toast.success("Removido dos filmes para assistir!");
        }
        };

    useEffect(() => {
        window.scrollTo(0, 0)
        const getMedia = async () => {
            dispatch(setGlobalLoading(true))
            const { response, err } = await mediaApi.getDetail({ mediaType, mediaId })
            dispatch(setGlobalLoading(false))

            if (response) {
                setMedia(response)
                setIsFavorite(response.isFavorite)
                setGenres(response.genres.splice(0, 2))

            }

            if (err) toast.error(err.message)
        }

        getMedia();

    }, [mediaType, mediaId, dispatch])

    return (
        media ? (
            <>
                <ImageHeader imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)} />
                <Box
                    sx={{
                        colors: "primary.contrastText",
                        ...uiConfigs.style.mainContent
                    }}
                    >
                    {/* conteudo da midia */}
                    <Box
                        sx={{
                            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem"}
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { md: "row", xs: "column" }
                        }}>
                            {/* Poster */}
                            <Box
                                sx={{
                                    width: {xs: "70%", sm: "50%", md: "40%"},
                                    margin: {xs: "0 auto 2rem", md: "0 2rem 0 0"}
                                }}
                            >
                                <Box sx={{
                                    paddingTop: "140%",
                                    ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(media.poster_path || media.backdrop_path))
                                }}>
                                </Box>

                            </Box>
                            {/* Poster */}

                            {/* Conteudo da midia */}
                            <Box
                                sx={{
                                    width: {xs: "100%", md: "60%"},
                                    color: "text.primary",                                    
                                }}
                                >
                                    <Stack spacing={5}>
                                        {/* Titulo */}
                                        <Typography
                                            variant='h4'
                                            fontSize={{ xs: "2rem", md: '2rem', lg: "3rem"}}
                                            fontWeight="700"
                                            sx={{...uiConfigs.style.typoLines(1, {lg: "left", xs: "center"})}}
                                        >   
                                            {`${media.title || media.name } ${mediaType === tmdbConfigs.mediaType.movie ? media.release_date.split("/")[0] : media.first_air_date.split["/"][0]}`}
                                        </Typography>
                                        {/* Titulo */}

                                        {/* informação da midia */}
                                        <Stack direction="row" spacing={1}>
                                            <CircularRate value={media.vote_average} />    { /** AVALIACAO */}
                                            <Divider orientation='vertical' />
                                            {genres.map((genre, index) => (
                                                <Chip 
                                                    label={genre.name}
                                                    variant="filled"
                                                    color="primary"
                                                    key={index}
                                                />
                                            ))}

                                        </Stack>
                                        {/* informação da midia */}

                                        {/* Sinopse */}
                                        <Typography
                                            variant="body1"
                                            sx={{...uiConfigs.style.typoLines(4)}}
                                            align='justify'
                                        >
                                            {media.overview}
                                        </Typography>
                                        {/* Sinopse */}


                                        {/* Botoes */}
                                        <Stack direction="row" spacing={1}>
                                            <LoadingButton 
                                                variant="text"
                                                sx={{
                                                    width: "max-content",
                                                    "& .MuiButon-starIcon": { marginRight: "0"}
                                                }}
                                                size='large'
                                                startIcon={isFavorite ? <FavoriteIcon/> : <FavoriteBorderOutlinedIcon /> }
                                                loadingPosition='start'
                                                loading={onRequest}
                                                onClick={onFavoriteClick}
                                            />
                                            <Button
                                            variant='contained'
                                            sx={{ width: "max-content" }}
                                            size="large"
                                            startIcon={<PlayArrowOutlinedIcon/>}
                                            onClick={() => videoRef.current.scrollIntoView()}
                                        >
                                            Assistir agora
                                        </Button>
                                        </Stack>


                                        {/* Botoes */}

                                        {/* Elenco */}
                                        <Container header="Elenco">
                                            <CastSlide casts={media.credits.cast} />
                                        </Container>

                                        {/* Elenco */}

                                    </Stack>

                            </Box>

                            {/* Conteudo da midia */}

                            
                        </Box>


                    </Box>
                    
                    {/* conteudo da midia */}

                    {/* videos da midia */}

                    <div ref={videoRef} style={{ paddingTop: "2rem"}} >
                        <Container header='Videos'>
                                <MediaVideosSlide videos={media.videos.results.splice(0, 6)}/>  {/** 6 filmes */}
                        </Container>

                    </div>

                    {/* videos da midia */}

                    {/* imagens do filme  */}
                    {media.images.backdrops.length > 0 && (
                        <Container header='imagens'>
                            <BackdropSlide backdrops={media.images.backdrops}/>
                        </Container>
                    )}
                    {/*  imagens */}

                    {/* RECOMENDAÇÃO DE FILMES */}
                    <Container header="voce tambem pode gostar">
                        {media.recommend.length > 0 && (
                            <RecommendSlide medias={media.recommend} mediaType={mediaType}/>
                        )}
                        {media.recommend.length === 0 && (
                            <MediaSlide
                                mediaType={mediaType}
                                mediaCategory={tmdbConfigs.mediaCategory.top_rated}
                            />
                        )}
                    </Container>
                    {/* RECOMENDAÇÃO DE FILMES */}



                </Box>
            </> 
        ) : null
    )
}


export default MediaDetail;