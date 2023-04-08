import {
    Typography,
    styled,
} from "@mui/material";

const StyledTimer = styled("div")({
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translate(-50%, 0%)",
});

interface PropsInterface {
    timeLeft: number;
}

export const Timer = (props: PropsInterface) => {
    const seconds = Math.floor(props.timeLeft % 60);
    const minutes = Math.floor(props.timeLeft / 60);
    const timer = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    return (
        <StyledTimer>
            <Typography
                variant="h5"
                color="text.secondary"
                sx={{ textAlign: "center" }}
            >
                {`Pozostały czas: ${timer}`}
            </Typography>
        </StyledTimer>
    );
}