import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../redux/api/user';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    userName: Yup.string().when("isSignUp", {
        is: true,
        then: (schema) => schema.required("Name is required"),
    }),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
        .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/, "Password must be exactly 8 characters, contain at least one capital letter and one number")
        .required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [register, { isLoading: registerLoading }] = useRegisterMutation();
    const { userInfo } = useSelector(store => store.auth);
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    return (
        <div>
            <Formik
                initialValues={{ userName: '', email: '', password: '', isSignUp: false }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        if (!values.isSignUp) {
                            const response = await login({ email: values.email, password: values.password }).unwrap();
                            toast.success(`${response.message} 👍🤩`, { position: "top-center", closeOnClick: true });
                        } else {
                            const response = await register({ userName: values.userName, email: values.email, password: values.password }).unwrap();
                            toast.success(`${response.message}`, { position: "top-center", closeOnClick: true });
                        }
                        resetForm(); // Reset form fields after success
                        navigate(redirect);
                    } catch (error) {
                        toast.error(error?.data?.message || "An unexpected error occurred.");
                    }
                    setSubmitting(false);
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
                        <div className='inline-flex gap-2 mb-2 mt-10 items-center'>
                            <p className='prata-regular text-3xl'>{values.isSignUp ? "Sign up" : "Login"}</p>
                            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
                        </div>
                        {values.isSignUp && (
                            <>
                                <Field type="text" name="userName" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' />
                                <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
                            </>
                        )}
                        <Field type="email" name="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

                        <Field type="password" name="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

                        <div className='w-full flex justify-between text-sm mt-[-8px]'>
                            <p onClick={() => navigate('/forgot-password')} className='cursor-pointer'>Forgot Your Password?</p>
                            <p onClick={() => setFieldValue("isSignUp", !values.isSignUp)} className='cursor-pointer'>
                                {values.isSignUp ? "Login here" : "Create Account"}
                            </p>
                        </div>

                        <button type="submit" className='bg-black text-white px-8 py-2 mt-4' disabled={isSubmitting || loginLoading || registerLoading}>
                            {values.isSignUp ? (registerLoading ? "Signing Up..." : "Sign Up") : (loginLoading ? "Signing In..." : "Sign In")}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;