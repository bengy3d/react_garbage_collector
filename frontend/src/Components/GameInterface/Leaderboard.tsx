import { styled } from "@mui/material";
import { useMemo } from "react";
import { ClientsObjectInterface } from "../../Interfaces/Sockets/ClientInterface";

const StyledDiv = styled("div")({
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
});

interface PropsInterface {
    clients: ClientsObjectInterface;
}

export const Leaderboard = (props: PropsInterface) => {
    const sortedClients = useMemo(() => {
        return Object.keys(props.clients)
            .sort((a, b) => props.clients[b].score - props.clients[a].score)
            .map((clientId) => (
                <li key={clientId}>
                    {`${clientId}: ${props.clients[clientId].score}`}
                </li>
            ));
    }, [props.clients]);
    return (
        <StyledDiv>
            <ol>
                {sortedClients}
            </ol>
        </StyledDiv>
    );
};
