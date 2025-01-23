import Link from "next/link";
import ActiveLink from "../active-link/ActiveLink";

const navItems = [
  { path: '/about', text: 'About' },
  { path: '/pricing', text: 'Pricing' },
  { path: '/contact', text: 'Contact' },
]

const Navbar = () => {
  // console.log("Navbar creado");

  return (
    <nav className="flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded">
      <Link href={'/'} className="flex items-center">Home</Link>

      <div className="flex flex-1">
        {
          navItems.map(navItem => (
            // <ActiveLink key={navItem.path} path={navItem.path} text={navItem.text}/>
            <ActiveLink key={navItem.path} {...navItem}/>
          ))
        }
        {/* <a className="mr-2" href="/contact">
          Contact
        </a> */}
      </div>
    </nav>
  );
};

export default Navbar;
