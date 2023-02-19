import {
    Button,
    Card,
    CardContent,
    CardMedia,
    styled,
    Typography,
} from "@mui/material";
import React from "react";
import { GameStateInterface } from "../Interfaces/GameStateInterface";
import { GarbageInterface } from "../Interfaces/GarbageInterace";

interface PropsInterface {
    garbage: GarbageInterface;
    correctAnswer: string;
    score: number;
    gameState: GameStateInterface;
    startGame: () => void;
    endGame: () => void;
}

const StyledTimer = styled('div')({
    position: "absolute",
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0%)',
})

const StyledCard = styled(Card)({
    width: 250,
    position: "absolute",
    top: 0,
    left: 0,
    padding: 5,
});

const StyledStartCard = styled(Card)({
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
})

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    textAlign: "center",
});

export const Gui = (props: PropsInterface) => {
    const seconds = Math.floor(props.gameState.timeLeft % 60);
    const minutes = Math.floor(props.gameState.timeLeft / 60);
    const timeLeft = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    return (
        <>
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
                    image={`${process.env.PUBLIC_URL}/images/${props.garbage.imageName}.svg`}
                />
                <StyledCardContent>
                    {props.correctAnswer ? (
                        <Typography variant="subtitle1" color="text.secondary" sx={{backgroundColor: 'red'}}>
                            {`Zła odpowiedź, poprawna: ${props.correctAnswer}`}
                        </Typography>
                    ) : (
                        <Typography variant="subtitle1" color="text.secondary">
                            {props.garbage.description
                                ? props.garbage.description
                                : "Podnieś odpad"}
                        </Typography>
                    )}
                </StyledCardContent>
            </StyledCard>
            {props.gameState.status === "active" &&
                <StyledTimer>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        {`Pozostały czas: ${timeLeft}`}
                    </Typography>
                </StyledTimer>
            }
            {props.gameState.status === "inactive" &&
                <StyledStartCard>
                    <StyledCardContent>
                        <Typography
                            variant="h3"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            Koniec Gry
                        </Typography>
                        <Typography
                            variant="h4"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            {`Twój wynik to ${props.score}`}
                        </Typography>
                        <Button onClick={props.startGame}>
                            Zagraj ponownie
                        </Button>
                    </StyledCardContent>
                </StyledStartCard> 
            }
            {props.gameState.status === "notStarted" &&
                <StyledStartCard>
                    <StyledCardContent>
                        <Typography
                            variant="h3"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            Rozpocznij nową grę
                        </Typography>
                        <Button onClick={props.startGame}>
                            Rozpocznij
                        </Button>
                    </StyledCardContent>
                </StyledStartCard> 
            }
        </>
    )
};
