import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../redux/api/user';
import { toast } from 'react-toastify';

const Login = () => {
    const [currenState, setCurrenState] = useState("Sign up");
    const [userData, setUserData] = useState({});

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

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!userData.email || !userData.password || (currenState === "Sign up" && !userData.userName)) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            if (currenState === "Login") {
                const response = await login({ ...userData }).unwrap();
                setUserData({});
                navigate(redirect);
                toast.success(`${response.message} 👍🤩`, { position: "top-center", closeOnClick: true });
            } else {
                const response = await register({ ...userData }).unwrap();
                setCurrenState("Login");
                setUserData({});
                toast.success(`${response.message}`, { position: "top-center", closeOnClick: true });
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "An unexpected error occurred.");
        }
    };

    return (
        <div>
            <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
                <div className='inline-flex gap-2 mb-2 mt-10 items-center'>
                    <p className='prata-regular text-3xl'>{currenState}</p>
                    <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
                </div>
                {currenState === "Login" ? '' : (
                    <input
                        type="text"
                        name="userName"
                        className='w-full px-3 py-2 border border-gray-800'
                        required
                        placeholder='Name'
                        onChange={handleInputChange}
                    />
                )}
                <input
                    type="email"
                    name="email"
                    className='w-full px-3 py-2 border border-gray-800'
                    required
                    placeholder='Email'
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    className='w-full px-3 py-2 border border-gray-800'
                    required
                    placeholder='Password'
                    onChange={handleInputChange}
                />
                <div className='w-full flex justify-between text-sm mt-[-8px]'>
                    <p onClick={() => navigate('/forgot-password')} className='cursor-pointer'>Forgot Your Password?</p>
                    {currenState === "Login" ? (
                        <p onClick={() => setCurrenState("Sign up")} className='cursor-pointer'>Create Account</p>
                    ) : (
                        <p onClick={() => setCurrenState("Login")} className='cursor-pointer'>Login here</p>
                    )}
                </div>
                <button className='bg-black text-white px-8 py-2 mt-4 '>
                    {currenState === "Login"
                        ? loginLoading
                            ? "Signing In..."
                            : "Sign In"
                        : registerLoading
                            ? "Signing Up..."
                            : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Login;
