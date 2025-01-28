import { useSelector } from "react-redux"

const Profile = () => {

    const { userInfo } = useSelector(store => store.auth);

    return (
        <>
            <section className="py-10 my-auto dark:bg-gray-900">
                <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
                    <div
                        className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
                        <div className="">
                            <h1
                                className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">
                                Profile
                            </h1>
                            <h2 className="text-grey text-sm mb-4 dark:text-gray-400">Create Profile</h2>
                            <form>
                                {/* <!-- Cover Image --> */}
                                <div
                                    className="w-full rounded-sm bg-[url('https://i.pinimg.com/736x/f4/46/fe/f446fea20e0ffdc9182c9ff183d4d061.jpg')] bg-cover bg-center bg-no-repeat items-center">
                                    {/* <!-- Profile Image --> */}
                                    <div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-[url('https://i.pinimg.com/736x/41/24/8a/41248af5447eb4aa9622115912300f41.jpg')] bg-cover bg-center bg-no-repeat">

                                        <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">

                                            <input type="file" name="profile" id="upload_profile" hidden required />

                                            <label htmlFor="upload_profile">
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
                                        <input type="file" name="profile" id="upload_cover" hidden required />

                                        <div
                                            className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                                            <label htmlFor="upload_cover" className="inline-flex items-center gap-1 cursor-pointer">Cover

                                                <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none" strokeWidth="1.5"
                                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true">
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
                                </div>
                                <h2 className="text-center mt-1 font-semibold dark:text-gray-300">Upload Profile and Cover Image
                                </h2>
                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="username" className="mb-2 dark:text-gray-300">FullName</label>
                                        <input type="text"
                                            id="username"
                                            defaultValue={userInfo?.userName}
                                            className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                            placeholder="First Name" />
                                    </div>
                                    <div className="w-full  mb-4 lg:mt-6">
                                        <label htmlFor="email" className=" dark:text-gray-300">Email</label>
                                        <input type="email"
                                            disabled
                                            id="email"
                                            defaultValue={userInfo?.email}
                                            className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                            placeholder="email" />
                                    </div>
                                </div>

                                <div className="w-full font-semibold text-xl text-center mx-auto my-5">Change Password</div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    {/* <div className="w-full">
                                        <h3 className="dark:text-gray-300 mb-2">Sex</h3>
                                        <select
                                            className="w-full text-grey border-2 rounded-lg p-4 pl-2 pr-2 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800">
                                            <option disabled value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div> */}
                                    <div className="w-full">
                                        <h3 className="dark:text-gray-300 mb-2">New Password</h3>
                                        <input type="password" placeholder="Password"
                                            className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                                    </div>
                                    <div className="w-full">
                                        <h3 className="dark:text-gray-300 mb-2">Confirm Password</h3>
                                        <input type="password" placeholder="Password"
                                            className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                                    </div>
                                </div>
                                <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                                    <button type="submit" className="w-full p-4">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Profile
