import { Typography, styled } from "@mui/material";
import { ClientsObjectInterface } from "../Interfaces/Sockets/ClientInterface";

const StyledDiv = styled("div")({
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
});

interface PropsInterface {
    clients: ClientsObjectInterface;
}

export const Leaderboard = (props: PropsInterface) => (
    <StyledDiv>
        <ol>
        {Object.keys(props.clients).map((clientId) => (
            <li key={clientId}>
                {`${clientId}: ${props.clients[clientId].score}`}
            </li>
        ))}
        </ol>
    </StyledDiv>
);
