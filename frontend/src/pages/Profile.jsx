import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUpdateUserProfileMutation } from "../redux/api/user";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/features/auth/authSlice";
import proPic from "../assets/frontend_assets/profilePic.jpg";
import coverPic from "../assets/frontend_assets/coverPic.jpg";

const Profile = () => {
    const { userInfo } = useSelector((store) => store.auth);
    // console.log(userInfo?.avatar?.url);

    const [updateData, { isLoading }] = useUpdateUserProfileMutation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") ?? "/";

    // Yup validation schema
    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("Full Name is required"),

        password: Yup.string().notRequired().optional()
            .matches(/^(?=.*[A-Z0-9]).*$/, "Password must contain at least one uppercase letter or one number")
            .min(8, "Password must be at least 8 characters"), // Optional but must follow rules if provided

        confirmPassword: Yup.string().notRequired()
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
    });

    // console.log(userInfo)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(validationSchema) });

    // Image states
    const [avatar, setAvatar] = useState(userInfo?.avatar?.url ?? null);
    const [cover, setCover] = useState(userInfo?.cover?.url);
    const [newAvatar, setNewAvatar] = useState(false);
    const [newCover, setNewCover] = useState(false);

    // Handle file selection
    const handleFileChange = (e, setFileState, setNewFileState) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
                toast.error("File size should be less than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFileState(reader.result);
                setNewFileState(true); // Mark as new image
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const payload = { ...data };

            if (newAvatar) payload.avatar = avatar;
            if (newCover) payload.cover = cover;

            const response = await updateData(payload).unwrap();

            if (response.data) {
                dispatch(setCredentials(response.data));
                toast.success(`${response?.message} 👍🤩`, { position: "top-center", closeOnClick: true });
                navigate(redirect);
            } else {
                toast.error(response.error?.data?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "An unexpected error occurred.");
        }
    };

    return (
        <section className="py-10 my-auto dark:bg-gray-900">
            <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
                <div className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
                    <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">
                        Profile
                    </h1>
                    <h2 className="text-grey text-sm mb-4 dark:text-gray-400">Create Profile</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Profile and Cover Upload */}
                        <div className="w-full rounded-sm pt-5 bg-cover bg-center bg-no-repeat items-center" style={{ backgroundImage: `url(${cover ?? coverPic})` }}>
                            <div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${avatar ?? proPic})` }}>
                                <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                                    <input type="file" name="avatar" id="upload_avatar" hidden onChange={(e) => handleFileChange(e, setAvatar, setNewAvatar)} />
                                    <label htmlFor="upload_avatar">
                                        <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none"
                                            strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <input type="file" name="cover" id="upload_cover" hidden onChange={(e) => handleFileChange(e, setCover, setNewCover)} />
                                <label htmlFor="upload_cover" className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold cursor-pointer">Cover
                                    <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none"
                                        strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                        </path>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                        </path>
                                    </svg>
                                </label>
                            </div>
                        </div>
                        <h2 className="text-center mt-1 font-semibold dark:text-gray-300">Upload Profile and Cover Image</h2>

                        {/* Full Name */}
                        <div className="w-full mb-4 sm:mt-6">
                            <label htmlFor="username" className="mb-2 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                id="username"
                                defaultValue={userInfo?.userName}
                                {...register("userName", { required: "Full Name is required" })}
                                className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                placeholder="Enter Full Name"
                            />
                            {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="w-full mb-4 lg:mt-6">
                            <label htmlFor="email" className="dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                defaultValue={userInfo?.email}
                                disabled
                                className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>

                        {/* Change Password */}
                        <div className="w-full font-semibold text-xl text-center mx-auto my-5">Change Password</div>
                        <div className="flex flex-col lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                            <div className="w-full">
                                <h3 className="dark:text-gray-300 mb-2">New Password</h3>
                                <input
                                    type="password"
                                    placeholder="Enter New Password"
                                    {...register("password")}
                                    className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                />
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>
                            <div className="w-full">
                                <h3 className="dark:text-gray-300 mb-2">Confirm Password</h3>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register("confirmPassword")}
                                    className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                />
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                aria-disabled={isSubmitting || isLoading}
                                className="w-full p-4 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting || isLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Profile;
