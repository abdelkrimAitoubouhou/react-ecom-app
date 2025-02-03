import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
    MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol, MDBInput, MDBRadio
} from 'mdb-react-ui-kit';
import '../css/signUp.css';
import {Button} from "react-bootstrap";
import signUpImg from '../assets/sign-up.png';
import { Typography} from "@mui/material";
import { Link} from "react-router-dom";


// Define the schema
const schema = z.object({

    firstName: z.string(),
    lastName: z.string(),
    username: z.string().nonempty({message: "Username is required*"}),
    email: z.string().email().nonempty({message: "email is required*"}),
    password: z.string().nonempty({message: "Password is required*"}),
    confirmedPassword: z.string().nonempty({message: "Password is required*"})
});

const SignUp = () => {

    // Initialize the form with react-hook-form and zod resolver
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting}
    } = useForm({
        resolver: zodResolver(schema),
    });


    return (

        <MDBContainer fluid className='bg-dark' >
            <form onSubmit={handleSubmit}>
                <MDBRow className='d-flex justify-content-center align-items-center h-100 form-background'>
                    <MDBCol>

                        <MDBCard className='my-4'>

                            <MDBRow className='g-0'>

                                <MDBCol md='10' lg='6' className='d-flex align-items-center signup-icon'>
                                    <MDBCardImage style={{borderRadius: '8px', maxWidth: '84%'}} src={signUpImg}/>
                                </MDBCol>

                                <MDBCol md='6' className="sign-up">
                                    <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                                        <h3 className="mb-5 text-uppercase fw-bold"
                                            style={{color: "darkblue", textAlign: "center"}}>SIGN UP</h3>

                                        <MDBRow>
                                            <MDBCol md='6'>
                                                <MDBInput
                                                    className='w-100'
                                                    wrapperClass='mb-4'
                                                    placeholder="First name "
                                                    id='form1'
                                                    type='text'
                                                    size="lg"
                                                    {...register("firstName")}/>
                                            </MDBCol>

                                            <MDBCol md='6' style={{marginLeft: "-9px", width: "37%"}}>
                                                <MDBInput
                                                    className='w-100'
                                                    wrapperClass='mb-3'
                                                    placeholder="Last name "
                                                    id='form2'
                                                    type='text'
                                                    size="lg"
                                                    {...register("lastName")}/>
                                            </MDBCol>

                                        </MDBRow>

                                        <MDBInput
                                            className='w-100'
                                            wrapperClass='mb-4'
                                            placeholder="Email"
                                            id='form3'
                                            type='text'
                                            size="lg"
                                            {...register("email")}/>

                                        <div
                                            className='d-md-flex ustify-content-start align-items-center mb-4'
                                            style={{marginLeft: '125px'}}
                                        >
                                            <h6 className="fw-bold mb-0 me-4">Gender: </h6>
                                            <MDBRadio name='inlineRadio' id='inlineRadio1' value='option1'
                                                      label='Female'
                                                      inline/>
                                            <MDBRadio name='inlineRadio' id='inlineRadio2' value='option2' label='Male'
                                                      inline/>

                                        </div>

                                        <MDBInput
                                            className='w-100'
                                            wrapperClass='mb-4'
                                            placeholder="username"
                                            id='form4'
                                            type='text'
                                            size="lg"
                                            {...register("username")}/>

                                        <MDBInput
                                            className='w-100'
                                            wrapperClass='mb-4'
                                            placeholder="password"
                                            id='form5'
                                            type='password'
                                            size="lg"
                                            {...register("password")}/>

                                        <MDBInput
                                            className='w-100'
                                            wrapperClass='mb-4'
                                            placeholder="confirm your password"
                                            id='form6'
                                            type='password'
                                            size="lg"
                                            {...register("confirmedPassword")}/>

                                        <div className="d-flex justify-content-end ">
                                            <Button
                                                className='btn btn-warning'
                                                style={{marginRight: '12.5rem', width: '6rem'}}
                                            >
                                                Submit
                                            </Button>
                                        </div>

                                        <Typography sx={{textAlign: 'center', marginTop: '1rem'}}>
                                            Already have an account?{' '}
                                            <Link
                                                to="/login"
                                                variant="body2"
                                                sx={{alignSelf: 'center'}}
                                            >
                                                <h6>login</h6>
                                            </Link>
                                        </Typography>

                                    </MDBCardBody>

                                </MDBCol>
                            </MDBRow>

                        </MDBCard>

                    </MDBCol>
                </MDBRow>
            </form>
        </MDBContainer>
    )
}

export default SignUp;