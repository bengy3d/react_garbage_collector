import { Card, CardContent, Typography, styled, Button, CardActions } from "@mui/material";
import React, { useState } from "react";
import GamepadIcon from '@mui/icons-material/Gamepad';
import { RoomMetadataInterface } from "../../Api/Interfaces/RoomMetadataInterface";
import { MAX_PLAYER_COUNT } from "../../constants";
import { JoinRoomForm } from "./JoinRoomForm";

const StyledCardContent = styled(CardContent)({ 
    display: 'flex',
    gap: 16,
})

const StyledDivActions = styled('div')({
    marginLeft: 'auto',
    display: 'flex',
    gap: 16
})

interface PropsInterface {
    room: RoomMetadataInterface
}

export const Room = (props: PropsInterface) => {

    const [passwordInputOpen, setPasswordInputOpen] = useState(false);

    const handlePasswordInputEvent = () => {
        setPasswordInputOpen(prev => !prev);
    }

    return (
        <Card style={{ width: 600, backgroundColor: '#333' }}>
            <StyledCardContent>
                <GamepadIcon fontSize="large"/>
                <Typography 
                    sx={{marginLeft: 'auto'}} 
                    gutterBottom 
                    variant="h4" 
                    component="div"
                >
                    {props.room.name}
                </Typography>
                <StyledDivActions>
                    <Typography gutterBottom variant="h4" component="div">
                        {props.room.numOfClients} / {MAX_PLAYER_COUNT}
                    </Typography>
                    <Button 
                        onClick={handlePasswordInputEvent} 
                        variant="contained" 
                        sx={{ marginLeft: 'auto' }}
                    >
                        JOIN 
                    </Button>
                </StyledDivActions>
                <JoinRoomForm 
                    roomName={props.room.name}
                    open={passwordInputOpen} 
                    handleClose={handlePasswordInputEvent}
                />
            </StyledCardContent>
        </Card>
    );
}
