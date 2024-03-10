import { Button, styled, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

interface CreateRoomFormInterface {
    roomName: String;
    password: String;
}

const createRoomFormValidationSchema = yup.object({
    roomName: yup
        .string()
        .max(50, 'Room name is too long')
        .required('Room name is required'),
    password: yup
        .string()
        .required('Password is required')
})

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
})

export const CreateRoomForm = () => {
    const navigate = useNavigate();

    const {values, handleChange, handleSubmit, touched, errors} = 
        useFormik<CreateRoomFormInterface>({
            initialValues: {
                roomName: '',
                password: '',
            },
            validationSchema: createRoomFormValidationSchema,
            onSubmit: () => {
                navigate('/play', {
                    state: {
                        roomName: values.roomName, 
                        password: values.password
                    }
                });
            }
        })

    return (
        <StyledForm
            onSubmit={handleSubmit} 
            autoComplete="off"
        >
            <Typography variant="h4">
                Create a room
            </Typography>
            <TextField 
                fullWidth
                name="roomName"
                label="Room name"
                value={values.roomName}
                onChange={handleChange}
                error={touched.roomName && Boolean(errors.roomName)}
                helperText={touched.roomName && Boolean(errors.roomName)}
            />
            <TextField 
                fullWidth
                name="password"
                label="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && Boolean(errors.password)}
            />
            <Button type="submit">
                Create room
            </Button>
        </StyledForm>
    )
}
