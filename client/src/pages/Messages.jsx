export default function Messages() {
  return (
    <div className="p-6 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
        <p className="text-white mb-6">Chat with other users about food pickup and delivery.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-black font-medium"> Coming soon...</p>
          <p className="text-black text-sm mt-1">
            This feature is currently under development and will be available in a future update.
          </p>
        </div>
        <img
          src="/cricket.png"
          alt="*Cricket image*"
          className="w-full max-w-xs mx-auto mt-6 rounded-lg"
        />
      </div>
    </div>
  );
}
