import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="hero min-h-screen bg-base-200 flex p-20">

        <div className="w-auto h-auto flex-1">
          <h1 className="text-5xl font-bold text-primary">Stay Connected, Anytime, Anywhere-</h1>
          <p className="py-6">An optimal way to be connected with others</p>
  
          <Link to="/auth" className="btn btn-primary">Get Started</Link>
        </div>

        <div className='flex-1 h-auto'>
          <img src={'canvaImage.png'} alt="" />

        </div>
     
    </div>
  );
};

export default Landing