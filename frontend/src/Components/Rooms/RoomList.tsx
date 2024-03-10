import { styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RoomMetadataObjectInterface } from '../../Api/Interfaces/RoomMetadataInterface';
import RoomService from '../../Api/Services/RoomService';
import { Room } from './Room';


const StyledDiv = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center'
})

export const RoomList = () => {
    const [roomList, setRoomList] = useState<RoomMetadataObjectInterface>({});

    useEffect(() => {
        RoomService.getRooms().then((response) => {
            setRoomList(response.data);
        })
    }, [])

    const roomListKeys = Object.keys(roomList);

    
    return (
        <StyledDiv>
            <Typography variant="h4">
                Room list
            </Typography>
            {roomListKeys.length ? 
                roomListKeys.map((roomName) => (
                    <Room key={roomName} room={roomList[roomName]} />
                ))
                :
                <Typography>There's no rooms available. Please create your own room</Typography>
            }
        </StyledDiv>
    )
}
