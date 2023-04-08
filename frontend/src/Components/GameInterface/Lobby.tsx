import { Button, Card, CardContent, styled, Typography } from "@mui/material";
import { ClientsObjectInterface } from "../../Interfaces/Sockets/ClientInterface";
import { SocketClient } from "../../SocketClient";

const StyledStartCard = styled(Card)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
});

const StyledCardContent = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    gap: 15,
    textAlign: "center",
});

interface PropsInterface {
    gameStatus: string;
    numOfReadyClients: number;
    score: number;
    clients: ClientsObjectInterface;
}

export const Lobby = (props: PropsInterface) => {
    const onClickReady = () => {
        SocketClient.emit("ready");
    };

    const getConnectedClientsNumber = () => {
        return Object.keys(props.clients).length;
    };

    return (
        <StyledStartCard>
            <StyledCardContent>
                <Typography
                    variant="h3"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                >
                    {props.gameStatus === "notStarted"
                        ? "Rozpocznij nową grę"
                        : "Koniec Gry"}
                </Typography>
                {props.gameStatus === "inactive" && (
                    <Typography
                        variant="h4"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        {`Twój wynik to ${props.score}`}
                    </Typography>
                )}
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                >
                    {`Gotowi ${
                        props.numOfReadyClients
                    }/${getConnectedClientsNumber()}`}
                </Typography>
                {!props.clients[SocketClient.id]?.ready && (
                    <Button onClick={onClickReady}>
                        {props.gameStatus === "notStarted"
                            ? "Rozpocznij"
                            : "Zagraj ponownie"}
                    </Button>
                )}
            </StyledCardContent>
        </StyledStartCard>
    );
};
