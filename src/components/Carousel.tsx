import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    url: '/Carrusel/20250821_123956.jpg',
    title: 'Ramos Isis',
    subtitle: 'Belleza y elegancia en cada detalle'
  },
  {
    url: '/Carrusel/20250829_070914.jpg',
    title: 'Ramos artificiales',
    subtitle: 'Con accesorios increíbles'
  },
  {
    url: '/Carrusel/20250923_072044.jpg',
    title: 'Momentos Especiales',
    subtitle: 'Perfectos para cada ocasión'
  }
];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
        <div
          className={`text-center transition-all duration-700 ${
            currentIndex >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 animate-pulse">
            {carouselImages[currentIndex].title}
          </h2>
          <p className="text-2xl md:text-3xl lg:text-4xl drop-shadow-lg text-pink-100 font-medium tracking-wide">
            {carouselImages[currentIndex].subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-pink-500/30 to-rose-500/30 backdrop-blur-md hover:from-pink-500/50 hover:to-rose-500/50 p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-2xl invisible md:visible"
      >
        <ChevronLeft size={32} className="text-white drop-shadow-lg " />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-pink-500/30 to-rose-500/30 backdrop-blur-md hover:from-pink-500/50 hover:to-rose-500/50 p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-2xl invisible md:visible"
      >
        <ChevronRight size={32} className="text-white drop-shadow-lg" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-12 h-3 bg-gradient-to-r from-pink-400 to-rose-400 shadow-lg shadow-pink-500/50'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            } rounded-full`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent z-15" />
    </div>
  );
}
