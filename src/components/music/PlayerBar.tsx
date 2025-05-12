export default function PlayerBar() {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between shadow-md z-50">
        <div>
          <p className="font-medium">🎵 Now Playing: <span className="text-blue-600">Lofi Chill</span></p>
          <p className="text-sm text-gray-500">by DJ Relax</p>
        </div>
        <div className="flex items-center space-x-4">
          <button>⏮</button>
          <button className="text-xl">⏯</button>
          <button>⏭</button>
        </div>
      </div>
    )
  }
  