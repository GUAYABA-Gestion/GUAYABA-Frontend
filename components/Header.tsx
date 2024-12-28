import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-emerald-600  flex items-center justify-between">
            {/* First image on the left */}
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png" 
                alt="Left Image" 
                className="h-10 px-200" 
            />

            {/* Second image on the right */}
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png" 
                alt="Right Image" 
                className="h-10 px-200" 
            />
        </header>
    );
};

export default Header;

