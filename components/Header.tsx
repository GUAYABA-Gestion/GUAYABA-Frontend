import Link from "next/link";
const Header = () => {
    return (
    <header className="header">
        <img src="logo.png" alt="Guayaba Logo" className="logo" />
        <nav>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    </header>
    );
  };

  export default Header