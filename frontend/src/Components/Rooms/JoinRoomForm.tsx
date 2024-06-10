import { Button, Card, Modal, Paper, styled, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

interface JoinRoomInterface {
    password: String;
}

const joinRoomFormValidationSchema = yup.object({
    password: yup
        .string()
        .required('Password is required')
})

const StyledCard = styled(Card)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
})

const StyledForm = styled('form')({
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
})

interface PropsInterface {
    roomName: string,
    open: boolean,
    handleClose: () => void
}

export const JoinRoomForm = (props: PropsInterface) => {
    const navigate = useNavigate();

    const {values, handleChange, handleSubmit, touched, errors} = 
        useFormik<JoinRoomInterface>({
            initialValues: {
                password: '',
            },
            validationSchema: joinRoomFormValidationSchema,
            onSubmit: () => {
                navigate('/play', {
                    state: {
                        roomName: props.roomName,
                        password: values.password
                    }
                });
            }
        })

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
        >
            <StyledCard>
                <StyledForm
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >
                    <Typography variant="h4" textAlign="center">
                        Join room - {props.roomName}
                    </Typography>
                    <TextField 
                        label="Room password"
                        fullWidth
                        type="text"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && Boolean(errors.password)}
                    />
                    <Button type="submit">
                        Join
                    </Button>
                </StyledForm>
            </StyledCard>
        </Modal>
    )
}
