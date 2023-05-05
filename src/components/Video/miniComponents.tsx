import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactEventHandler, useState } from "react";

dayjs.extend(relativeTime);

export function LikeComponent(props: { userLiked?: boolean; count: string }) {
    const icon = (
        <ThumbUpIcon
            color={props.userLiked ? "action" : "disabled"}
            fontSize="small"
        />
    );
    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap={"nowrap"}
                component="span"
            >
                <IconButton color="primary" disabled>
                    {icon}
                </IconButton>
                <Typography
                    variant={"subtitle2"}
                    sx={{ mb: "-2px" }}
                    component="span"
                >
                    {props.count}
                </Typography>
            </Stack>
        </>
    );
}

export function NameComponent(props: {
    authorName: string;
    creationDate: string;
}) {
    // creationDate maps to the creation date of the comment
    return (
        <>
            <Stack
                justifyContent={"space-between"}
                flexDirection={"row"}
                flexWrap={"nowrap"}
            >
                <Typography variant="subtitle2">{props.authorName}</Typography>
                <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                    {dayjs(props.creationDate).fromNow()}
                </Typography>
            </Stack>
        </>
    );
}

export function CommentAvatarComponent(props: {
    pfp: string;
    className: string;
}) {
    const [isImage, setIsImage] = useState(true);
    function fallback() {
        setIsImage(false);
    }

    return (
        <ListItemAvatar>
            <Avatar className={props.className}>
                {isImage ? (
                    <Image
                        src={props.pfp}
                        fill
                        alt="Profile Picture"
                        quality={"100"}
                        onError={fallback}
                    />
                ) : (
                    <PersonIcon />
                )}
            </Avatar>
        </ListItemAvatar>
    );
}
