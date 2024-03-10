import { Button, Modal, styled, TextField, Typography } from '@mui/material';
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

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
})

interface PropsInterface {
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
            <StyledForm
                onSubmit={handleSubmit} 
                autoComplete="off"
            >
                <Typography variant="h4">
                    Join room
                </Typography>
                <TextField 
                    fullWidth
                    type="password"
                    name="password"
                    label="password"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && Boolean(errors.password)}
                />
                <Button type="submit">
                    Join
                </Button>
            </StyledForm>
        </Modal>
    )
}
