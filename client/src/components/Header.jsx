export function Header() {
  return (
    <header className=" text-white px-6 py-8 text-center">
      <div className="flex flex-col items-center">
        <img
          src="/mathjalte-notext.png"
          alt="MatHjälten logo"
          className="w-1/2 max-w-48 aspect-square rounded-full border-4 border-gray-500/25 shadow-lg mb-4"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-wide mb-2">MatHjälten</h1>
          <p className="text-base">Save food, save the planet</p>
        </div>
      </div>
    </header>
  );
}
