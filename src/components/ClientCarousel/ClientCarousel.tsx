import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function ClientCarousel({ children }: { children: React.ReactElement[] }) {
  return (
    <div className="relative rounded-md overflow-hidden" style={{ contain: 'layout style paint' }}>
      <Carousel
        className="rounded-md"
        infiniteLoop
        autoPlay
        emulateTouch
        interval={5000}
        showStatus={false}
        showThumbs={false}
        stopOnHover={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[1] h-10 w-10 cursor-pointer text-gray-500 bg-white dark:bg-gray-700 rounded-md opacity-75 hover:opacity-100 transition-opacity shadow-lg"
              style={{ 
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            >
              <ChevronLeft size={30} strokeWidth={1.5}/>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[1] h-10 w-10 cursor-pointer text-gray-500 bg-white dark:bg-gray-700 rounded-md opacity-75 hover:opacity-100 transition-opacity shadow-lg"
              style={{ 
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            >
              <ChevronRight size={30} strokeWidth={1.5}/>
            </button>
          )
        }
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        if (isSelected) {
          return (
            <li
              className="rounded-sm bg-gray-300 dark:bg-gray-600 opacity-100 w-[30px] h-1 inline-block mx-1 cursor-pointer transition-opacity"
              aria-label={`Selected: ${label} ${index + 1}`}
              title={`Selected: ${label} ${index + 1}`}
            />
          );
        }
        return (
          <li
            className="rounded-sm bg-gray-200 dark:bg-gray-700 opacity-50 w-[30px] h-1 inline-block mx-1 cursor-pointer hover:opacity-100 transition-opacity"
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
            title={`${label} ${index + 1}`}
            aria-label={`${label} ${index + 1}`}
          />
        );
      }}
      >
        {children}
      </Carousel>
    </div>
  );
}

export default ClientCarousel;
