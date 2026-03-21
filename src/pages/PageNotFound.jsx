import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#446072] p-8 flex flex-col items-center overflow-hidden font-mono text-white">
      /* Custom Styles for Animations */
      <style>{`
        @keyframes leftDoorOpen {
          60% { transform: rotateY(-115deg); }
          100% { transform: rotateY(-110deg); }
        }
        @keyframes rightDoorOpen {
          60% { transform: rotateY(125deg); }
          100% { transform: rotateY(120deg); }
        }
        .animate-door-left {
          animation: leftDoorOpen 3.5s ease-out forwards 1s;
          transform-origin: left;
        }
        .animate-door-right {
          animation: rightDoorOpen 3s ease-out forwards 1.5s;
          transform-origin: right;
        }
      `}</style>

      <nav className="relative w-[30rem] h-[14rem] mx-auto border-[0.5rem] border-[#374d5b] rounded-lg bg-white/10 perspective-[130rem] shadow-inner">

        /* Books */
        <Link to="/" className="absolute px-16 py-3 rounded bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors -rotate-90 -translate-x-[12.4rem] translate-y-[3rem] origin-left">
          Home
        </Link>

        <Link to="/clubs" className="absolute px-16 py-3 rounded bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors -rotate-[100deg] -translate-x-[13.4rem] translate-y-[6.1rem] origin-left">
          Clubs
        </Link>

        <Link to="/profile" className="absolute right-3 bottom-12 px-16 py-3 rounded-l bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors">
          Profile
        </Link>

        <Link to="/contact" className="absolute right-8 bottom-1 px-16 py-3 rounded-l bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors">
          Login
        </Link>

        /* The Missing Book Placeholder */
        <span className="absolute w-[12rem] h-[3.5rem] border border-dashed border-white/30 -rotate-90 -translate-x-[12rem] translate-y-[13rem] origin-left opacity-30"></span>

        /* Doors */
        <span className="absolute w-[14.8rem] h-full bg-[#374d5b] shadow-md z-10 flex items-center p-4 rounded-r-xl animate-door-left after:content-[''] after:w-6 after:h-6 after:bg-black/10 after:rounded-full after:ml-auto"></span>

        <span className="absolute right-0 w-[14.8rem] h-full bg-[#374d5b] shadow-md z-10 flex items-center p-4 rounded-l-xl animate-door-right before:content-[''] before:w-6 before:h-6 before:bg-black/10 before:rounded-full"></span>
      </nav>

      <h1 className="mt-8 text-4xl font-bold text-center">Error 404</h1>
      <p className="text-center mt-2">The page you're looking for can't be found</p>
    </div>
  );
};

export default NotFound;