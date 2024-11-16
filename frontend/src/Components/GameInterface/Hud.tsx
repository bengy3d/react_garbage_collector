import {
    Card,
    CardContent,
    CardMedia,
    styled,
    Typography,
} from "@mui/material";
import { GarbageInterface } from "../../Interfaces/GarbageInterace";

const StyledCard = styled(Card)({
    width: 250,
    position: "absolute",
    top: 0,
    left: 0,
    padding: 5,
});

const StyledCardContent = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    gap: 15,
    textAlign: "center",
});

interface PropsInterface {
    score: number;
    garbage: GarbageInterface;
    correctAnswer: string;
}

export const Hud = (props: PropsInterface) => (
    <StyledCard>
        <Typography
            variant="h5"
            color="text.secondary"
            sx={{ textAlign: "center" }}
        >
            {`Wynik: ${props.score}`}
        </Typography>
        <CardMedia
            component="img"
            height="200"
            image={`/images/${props.garbage.imageName}.svg`}
        />
        <StyledCardContent>
            {props.correctAnswer ? (
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ backgroundColor: "red" }}
                >
                    {`Zła odpowiedź, poprawna: ${props.correctAnswer}`}
                </Typography>
            ) : (
                <Typography variant="subtitle1" color="text.secondary">
                    {props.garbage.description
                        ? props.garbage.description
                        : "Podnieś odpad"
                    }
                </Typography>
            )}
        </StyledCardContent>
    </StyledCard>
)
