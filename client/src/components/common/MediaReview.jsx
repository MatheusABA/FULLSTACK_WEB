import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import DeleteIcon from "@mui/icons-material/Delete"
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import { useSelector } from "react-redux";
import Container from "./Container";
import reviewApi from '../../api/modules/reviewApi'

const ReviewItem = ({ review, onRemoved }) => {
    const { user } = useSelector((state) => state.user)

    const [onRequest, setOnRequest] = useState(false)

    const onRemove = async () => {
        if (onRequest) return
        
        setOnRequest(true)
        const { response, err } = await reviewApi.remove({ reviewId: review.id})

        if (err) toast.error(err.message)
        if (response) onRemoved(review.id)
    }

    return (
        <Box sx={{
            padding: 2,
            borderRadius: "5px"
        }}
        >

        </Box>
    )
}