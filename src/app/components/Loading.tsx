import { LoadingDots } from "../components/loading-dots"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Modern Loading Component</h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Default:</span>
            <LoadingDots />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Large Blue:</span>
            <LoadingDots color="#3B82F6" size={8} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Slow Green:</span>
            <LoadingDots color="#10B981" size={6} speed={1.2} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Fast Purple:</span>
            <LoadingDots color="#8B5CF6" size={5} speed={0.5} />
          </div>
        </div>
      </div>
    </div>
  )
}

