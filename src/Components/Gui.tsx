import { Box, Card, CardContent, CardMedia, styled, Typography } from '@mui/material';
import React from 'react';
import { GarbageInterface } from '../Interfaces/GarbageInterace';

interface PropsInterface {
    garbage: GarbageInterface;
    score: number;
}

const StyledCard = styled(Card)({
    width: 250,
    position: "absolute",
    top: 0,
    left: 0,
    padding: 5,
});

const StyledScoreBox = styled(Box)({
    position: "absolute",
    top: 0,
    left: 260,
    padding: 5,
})

export const Gui = (props: PropsInterface) => (
    <>
        <StyledCard>
            <CardMedia
                component="img"
                height="250"
                image={`${process.env.PUBLIC_URL}/images/${props.garbage.imageName}.svg`}
            />
            <CardContent>
                <Typography variant="h5" color="text.secondary" sx={{textAlign: 'center'}}>
                    {props.garbage.description ? props.garbage.description : "Podnieś odpad"}
                </Typography>
            </CardContent>
        </StyledCard>
        <StyledScoreBox>
            <Typography variant="h5" color="text.secondary" sx={{textAlign: 'center'}}>
                {`Wynik: ${props.score}`}
            </Typography>
        </StyledScoreBox>
    </>
)