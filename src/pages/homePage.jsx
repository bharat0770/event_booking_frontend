import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col xl:px-40">

   
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 py-10 flex-1">

    
        <div className="max-w-xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Find Amazing Events Near You
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            Book concerts, tech meetups, sports events, and live shows in seconds.
            Your next experience is just one click away.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700" onClick={() => navigate("/event/list")}>
              Get Started
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100">
              Learn More
            </button>
          </div>
        </div>

      
        <div className="mb-10 lg:mb-0">
          <img
            src="https://illustrations.popsy.co/gray/digital-nomad.svg"
            alt="Hero"
            className="w-[350px] lg:w-[500px]"
          />
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div className="text-center py-6 text-gray-500 text-sm border-t">
        Built with React + Tailwind • Simple. Fast. Modern.
      </div>
    </div>
  );
};

export default HomePage;