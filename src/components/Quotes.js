import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper';

export default function Quotes({ list = [] }) {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-full"
      >
        {list
          .map((item) => [item.positive, item.negative])
          .flat()
          .map((item) => (
            <SwiperSlide className="w-9/12">
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <p className="text-2xl font-serif">{item}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
