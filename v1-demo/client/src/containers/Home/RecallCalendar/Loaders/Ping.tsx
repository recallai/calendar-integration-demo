export default function Ping() {
  return (
    <span className="relative flex w-4 h-4">
      <span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping"></span>
      <span className="relative inline-flex w-4 h-4 bg-indigo-500 rounded-full"></span>
    </span>
  );
}
