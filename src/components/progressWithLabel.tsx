import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
    LinearProgressProps,
} from "@mui/material/LinearProgress";

export default function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number; label: string }
) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {props.label}
                </Typography>
            </Box>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
