export default function PageLoader() {
  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  )
}
