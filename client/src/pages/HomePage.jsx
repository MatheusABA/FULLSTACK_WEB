import React from 'react'
import HeroSlide from '../components/common/HeroSlide'
import tmdbConfigs from '../api/configs/tmdbConfigs'
import { Box } from '@mui/material'
import uiConfigs from '../configs/uiConfig'
import Container from '../components/common/Container'
import MediaSlide from '../components/common/MediaSlide'

const HomePage = () => {
    return (
        <>  
            {/* estilizando slide principal */}
            <HeroSlide 
                mediaType={tmdbConfigs.mediaType.movie}
                mediaCategory={tmdbConfigs.mediaCategory.popular}
            />

            {/* filems populares */}
            <Box  
                marginTop="-4rem"
                sx={{
                    ...uiConfigs.style.mainContent
                }}
            >
                <Container
                    header="filmes populares"   // sera transformado para UPPERCASE no container
                >
                    <MediaSlide
                        mediaType={tmdbConfigs.mediaType.movie}
                        mediaCategory={tmdbConfigs.mediaCategory.popular}
                    />
                </Container>
{/* 
                <Container
                    header="series populares"   // sera transformado para UPPERCASE no container
                >
                    <MediaSlide
                        mediaType={tmdbConfigs.mediaType.tv}
                        mediaCategory={tmdbConfigs.mediaCategory.popular}
                    />
                </Container> */}

                <Container
                    header="filmes com melhor avaliação"   // sera transformado para UPPERCASE no container
                >
                    <MediaSlide
                        mediaType={tmdbConfigs.mediaType.movie}
                        mediaCategory={tmdbConfigs.mediaCategory.top_rated}
                    />
                </Container>
{/* 
                <Container
                    header="series com melhor avaliação"   // sera transformado para UPPERCASE no container
                >
                    <MediaSlide
                        mediaType={tmdbConfigs.mediaType.tv}
                        mediaCategory={tmdbConfigs.mediaCategory.top_rated}
                    />
                </Container> */}


            </Box>
        </>
    )
}

export default HomePage