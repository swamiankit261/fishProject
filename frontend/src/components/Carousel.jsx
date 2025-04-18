import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const Carousel = () => {
    const images = [
        "myimg/me2.jpeg",
        "myimg/me1.jpeg",
        "myimg/me3.jpeg",
        "myimg/me4.jpeg",
    ]
    return (
        <div className="relative w-full">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                // scrollbar={{ draggable: true }}
                // navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="h-52 md:h-96 rounded"
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={src}
                            className="w-full h-full object-fill rounded"
                            alt={`Slide ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Carousel
