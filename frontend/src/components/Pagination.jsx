import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const Pagination = (props) => {

    const { totalPages = 5, active, setActive } = props || {};

    // Handlers for previous and next buttons
    const prev = () => {
        if (active > 1) setActive((prevPage) => prevPage - 1);
    };

    const next = () => {
        if (active < totalPages) setActive((prevPage) => prevPage + 1);
    };

    const handlePageClick = (page) => {
        setActive(page);
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mx-auto w-full sm:w-3/4 lg:w-1/2">
            {/* Previous Button */}
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={active === 1}
            >
                <ArrowLeftIcon strokeWidth={3} className="w-4 sm:w-5" /> Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                        <Button
                            key={page}
                            ripple={true}
                            className={`px-3 py-1 ${active === page
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}
                            size="sm"
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            {/* Next Button */}
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={next}
                disabled={active === totalPages}
            >
                Next
                <ArrowRightIcon strokeWidth={3} className="w-4 sm:w-5" />
            </Button>
        </div>
    );
};

export default Pagination;
