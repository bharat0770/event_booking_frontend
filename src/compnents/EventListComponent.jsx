const EventListComponent = ({ event, idx, navigate }) => {
  const formattedDate = new Date(
    event.eventDateTime
  ).toLocaleDateString();

  return (
    <div
      key={idx}
      onClick={() => navigate(`/event/${event._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row"
    >
      {/* Movie Poster */}
      <div className="w-full md:w-52 h-64 md:h-auto flex-shrink-0">
        <img
          src={
            event?.images[0] ||
            // "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
            "https://www.movieposters.com/cdn/shop/products/857805fc819baf858faad8cf6430be97_137b9671-5707-440b-ba63-e79dc6362497.jpg?v=1762500827&width=1680"
          }
          alt={event?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between p-5 flex-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {event?.name}
          </h2>

          <p className="text-gray-600 mt-2">
            {event?.venue}
          </p>

          <p className="text-gray-600 mt-1">
             {formattedDate}
          </p>

          <p className="text-gray-600 mt-1">
             {event?.totalSeats} Seats
          </p>
        </div>

        <div className="mt-4">
          <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-medium">
            View Seats
          </button>
        </div>
      </div>
    </div>
  );
};
export default EventListComponent;