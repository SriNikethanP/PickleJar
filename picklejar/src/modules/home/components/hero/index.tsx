import { Github } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-6 leading-tight">
              Pickle
              <span className="block text-red-500">Jar</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-black mb-12 leading-relaxed max-w-3xl mx-auto">
            Discover the art of perfectly crafted pickles, made with love and
            traditional recipes
          </p>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-red-500 text-black text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl hover:text-red-500 transform hover:-translate-y-1">
              Shop Now
            </button>
            <button className="px-8 py-4 border-2 border-red-500 text-black text-lg font-semibold rounded-lg hover:bg-white hover:text-black hover:bg-red-500/10 transition-colors duration-300">
              Learn More
            </button>
          </div> */}

          {/* Decorative Elements */}
          <div className="mt-16 flex justify-center space-x-8 opacity-60">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
