import { ArrowLeft } from 'react-feather';
import Post from './Post';
import { useState } from 'react';

function Bookmarks() {
  const [bookmarkedPosts] = useState([
    {
      id: '1',
      name: 'Elon Musk',
      username: 'elonmusk',
      avatar: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
      content: 'Exciting updates coming to X next week!',
      timestamp: '2d',
    },
    {
      id: '2',
      name: 'X',
      username: 'X',
      avatar: 'https://pbs.twimg.com/profile_images/1683899100922511362/5lY42eHs_400x400.jpg',
      content: 'Introducing new features for creators',
      timestamp: '5d',
    },
  ]);

  const [showClearDialog, setShowClearDialog] = useState(false);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-black bg-opacity-95 z-50 border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold">Bookmarks</h2>
              <p className="text-gray-500 text-sm">@yourusername</p>
            </div>
          </div>
          <button
            onClick={() => setShowClearDialog(true)}
            className="text-blue-500 hover:text-blue-400"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Bookmarked Posts */}
      {bookmarkedPosts.length > 0 ? (
        <div className="divide-y divide-gray-700">
          {bookmarkedPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Save posts for later</h2>
          <p className="text-gray-500 max-w-sm">
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      )}

      {/* Clear Bookmarks Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-black border border-gray-700 rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Clear all Bookmarks?</h3>
            <p className="text-gray-500 mb-8">
              This can't be undone and you'll remove all posts you've added to your Bookmarks.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearDialog(false)}
                className="flex-1 rounded-full border border-gray-700 py-2 font-bold hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add clear functionality here
                  setShowClearDialog(false);
                }}
                className="flex-1 rounded-full bg-red-500 py-2 font-bold hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;