function Widgets() {
  return (
    <div className="hidden lg:flex flex-col w-80 p-4 space-y-4">
      <div className="sticky top-0 py-2">
        <div className="bg-gray-800 rounded-full p-3">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full placeholder-gray-500"
          />
        </div>
      </div>

      <div className="border  border-gray-700 rounded-xl p-4 text-white">
        <h2 className="text-xl font-bold mb-4">{`What's happening`}</h2>
        <div className="space-y-4">
          {/* Trending topics would go here */}
          <div className="hover:bg-gray-700 p-3 rounded-xl cursor-pointer ">
            <span className="text-gray-500 text-sm">Trending in Technology</span>
            <p className="font-bold">#AI</p>
            <span className="text-gray-500 text-sm">500K posts</span>
          </div>
          <div className="hover:bg-gray-700 p-3 rounded-xl cursor-pointer">
            <span className="text-gray-500 text-sm">Trending in Business</span>
            <p className="font-bold">#Crypto</p>
            <span className="text-gray-500 text-sm">240K posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Widgets;