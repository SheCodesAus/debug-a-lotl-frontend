import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#446072] p-8 flex flex-col items-center overflow-hidden font-mono text-white">
      {/* Custom Styles for Animations */}
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

      <nav className="relative `w-120` `h-56` mx-auto `border-8` border-[#374d5b] rounded-lg bg-white/10 shadow-inner" style={{ perspective: '130rem' }}>

        {/* Books */}
        <Link to="/" className="absolute px-16 py-3 rounded bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors origin-left" style={{ transform: 'rotate(-90deg) translate(-12.4rem, 3rem)' }}>
          Home
        </Link>

        <Link to="/clubs" className="absolute px-16 py-3 rounded bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors origin-left" style={{ transform: 'rotate(-100deg) translate(-13.4rem, 6.1rem)' }}>
          Clubs
        </Link>

        <Link to="/profile" className="absolute right-3 bottom-12 px-16 py-3 rounded-l bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors">
          Profile
        </Link>

        <Link to="/login" className="absolute right-8 bottom-1 px-16 py-3 rounded-l bg-white/10 text-white uppercase tracking-widest text-sm hover:bg-white/20 transition-colors">
          Login
        </Link>

        {/* The Missing Book Placeholder */}
        <span className="absolute `w-48` `h-14` border border-dashed border-white/30 origin-left opacity-30" style={{ transform: 'rotate(-90deg) translate(-12rem, 13rem)' }}></span>

        {/* Doors */}
        <span className="animate-door-left absolute w-[14.8rem] h-full bg-[#374d5b] shadow-md z-10 flex items-center justify-end p-4 rounded-r-xl">
          <span className="w-6 h-6 bg-black/10 rounded-full"></span>
        </span>

        <span className="animate-door-right absolute right-0 w-[14.8rem] h-full bg-[#374d5b] shadow-md z-10 flex items-center p-4 rounded-l-xl">
          <span className="w-6 h-6 bg-black/10 rounded-full"></span>
        </span>
      </nav>

      <h1 className="mt-8 text-4xl font-bold text-center">Error 404</h1>
      <p className="text-center mt-2">The page you're looking for can't be found</p>
    </div>
  );
};

export default NotFound;