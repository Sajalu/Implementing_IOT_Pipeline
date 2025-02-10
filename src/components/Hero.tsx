const Hero = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('https://images.unsplash.com/photo-1516402707257-787c50fc3898?auto=format&fit=crop&w=1920&q=80&ixlib=rb-1.2.1')]"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-hero-text">
            Welcome to Rakkaranta
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-hero-text">
            Experience the serenity of Finnish lakeside living
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="#rooms" 
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View Rooms
            </a>
            <a 
              href="#booking" 
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Check Availability
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;