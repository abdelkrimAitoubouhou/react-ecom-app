import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import axios from 'axios';
import {
    MDBContainer, MDBCol, MDBRow, MDBIcon, MDBInput, MDBCheckbox
} from 'mdb-react-ui-kit';
import '../css/login.css';
import {useNavigate} from 'react-router-dom';
import {Button, Image} from "react-bootstrap";
import { Typography} from "@mui/material";
import { Link} from "react-router-dom";


// Define the schema
const schema = z.object({
    username: z.string().nonempty({message: "Username is required*"}),
    password: z.string().nonempty({message: "Password is required*"})
});

const Login = ({onLogin}) => {
    const navigate = useNavigate();

    // Initialize the form with react-hook-form and zod resolver
    const {
        register, handleSubmit, setError, formState: {errors, isSubmitting}
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        const {username, password} = data;
        try {
            const response = await axios.post('http://localhost:8084/realms/test-spring-client/protocol/openid-connect/token', new URLSearchParams({
                username, password, client_id: 'order-client', grant_type: 'password'
            }));
            const token = response.data.access_token;
            onLogin(token);
            navigate('/products'); // Navigate to products page on successful auth
        } catch (error) {
            setError("root", {message: "Login failed ): "});
        }
    };

    return (<MDBContainer fluid className=" login-container" style={{marginTop: '2rem'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <MDBRow>
                <MDBCol col='10' md='6'>
                    <Image
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                        className="img-fluid"
                        alt="Phone image"
                    />
                </MDBCol>

                <MDBCol col='4' md='6' className="input-group-lg">

                    <h6>Username</h6>
                    {errors.username && (
                        <div className="text-red-500"
                             style={{
                                 color: "#e61919",
                                 fontWeight: "500"
                             }}>
                            {errors.username.message}</div>)}

                    <MDBInput
                        wrapperClass='mb-3'
                        placeholder="enter your username or email"
                        id='formControlLg'
                        type='text'
                        size="lg"
                        {...register("username")}
                    />

                    <h6>Password</h6>
                    {errors.password && (
                        <div className="text-red-500"
                             style={{
                                 color: "#e61919",
                                 fontWeight: "500"
                             }}>
                            {errors.password.message}</div>)}

                    <MDBInput
                        wrapperClass='mb-3'
                        placeholder="enter your password"
                        id='formControlLg'
                        type='password'
                        size="lg"
                        {...register("password")}
                    />


                    <div className="d-flex justify-content-between mx-4 mb-2">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me'/>
                        <a href="!#">Forgot password?</a>
                    </div>

                    <Button className="mt-2  w-100" size="lg" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>

                    <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0">OR</p>
                    </div>

                    <Button className="mb-3 w-100" size="lg" style={{backgroundColor: '#3b5998'}}>
                        <MDBIcon fab icon="facebook-f" className="mx-2"/>
                        Continue with Facebook
                    </Button>

                    <Button className="mb-3 w-100" size="lg" style={{backgroundColor: '#55acee'}}>
                        <MDBIcon fab icon="twitter" className="mx-2"/>
                        Continue with Twitter
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/sign-up"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>

                    </Typography>
                </MDBCol>
            </MDBRow>
        </form>
    </MDBContainer>);
}

export default Login;
