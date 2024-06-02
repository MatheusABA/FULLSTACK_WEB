import { Box } from "@mui/material"
import { SwiperSlide } from "swiper/react"
import tmdbConfigs from "../../api/configs/tmdbConfigs"
import AutoSwiper from "./AutoSwiper"

const PosterSlide = ({ posters }) => {
    return (
        <AutoSwiper>
            {[...posters].splice(0, 5).map((item, index) => (
                <SwiperSlide key={index}>
                    <Box sx={{
                        paddingTop: "160%", backgroundPosition: "top",
                        backgroundSize: "cover",
                        backgroundImage: `url(${tmdbConfigs.posterPath(item.file_path)})`
                    }} />


                </SwiperSlide>
            ))}
        </AutoSwiper>
    )
} 

export default PosterSlide