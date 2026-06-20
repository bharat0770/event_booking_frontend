const NavBar = () => {

  return (
    <div className="flex justify-between items-center px-6 lg:px-20 py-4 
                  bg-gradient-to-r from-red-500 via-red-600 to-red-700
                  shadow-lg sticky top-0  backdrop-blur-md z-100">

      {/* LOGO */}
      <h1 className="md:text-xl lg:text-2xl font-extrabold text-white tracking-wide">
        🎟️ BookingTest
      </h1>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6 md:text-lg font-medium">

        <a
          href="/"
          className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
        >
          Home
        </a>

        <a
          href="/event/list"
          className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
        >
          Event List
        </a>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("testUser");
            window.location.href = "/login";
          }}
          className="md:ml-2 bg-white text-red-600 font-semibold md:px-4 md:py-2 rounded-full
                   hover:bg-red-100 active:scale-95 transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );

}
export default NavBar; 