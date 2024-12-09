import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
} from '@material-tailwind/react';
import { ChevronDownIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@services/userService';

// Collections Dropdown
function CollectionsDropdown() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Nested Collection List
  const collections = {
    all: 'ALL',
    bracelet: 'BRACELETS',
    necklace: 'NECKLACES',
    ring: 'RINGS',
  };
  const collectionNestedList = Object.entries(collections).map(
    ([key, value]) => (
      <button
        className="p-1 text-sm font-normal text-blue-gray-700 hover:underline"
        key={key}
      >
        <NavLink to={`/collections/${key}`}>{value}</NavLink>
      </button>
    ),
  );

  return (
    <>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal hover:underline"
          >
            <div
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
              className="ml-2 flex items-center gap-1 justify-center"
            >
              COLLECTIONS
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-xl lg:block z-[9999]">
          <div className="flex flex-col gap-2 focus:outline-none">
            {collectionNestedList}
          </div>
        </MenuList>
      </Menu>
      {/* Mobile: Collapsed Menu */}
      <div className="block lg:hidden z-[9999]">
        <Collapse open={isMobileMenuOpen}>
          <div className="flex flex-col">{collectionNestedList}</div>
        </Collapse>
      </div>
    </>
  );
}

// Navigation Links
function navList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal hover:underline"
      >
        <NavLink to="/" className="flex items-center justify-center">
          HOME
        </NavLink>
      </Typography>
      <CollectionsDropdown />
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <NavLink
          to="/customize"
          className="flex items-center justify-center hover:underline"
        >
          CUSTOMIZE
        </NavLink>
      </Typography>
    </ul>
  );
}

export default function MyNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Close Nav on Window Resize
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false),
    );

    // Check if user is signed in on mount
    let isMounted = false;
    const checkStatus = async () => {
      if (isMounted) return;
      const user = await getCurrentUser();
      setIsSignedIn(user !== null);
      isMounted = true;
    };
    void checkStatus();

    // Set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar className="sticky top-0 z-[9998] h-max max-w-full rounded-none px-4 py-2 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold truncate mx-2">
            <h1>NAMAS CRYSTALS</h1>
          </NavLink>
          <div className="flex items-center">
            {/* Navigation Links */}
            <div className="mr-2 hidden lg:block">{navList()}</div>
            {/* User, Cart */}
            <div className="flex items-center gap-x-1">
              {isSignedIn ? (
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block"
                  onClick={() => (window.location.href = '/profile')}
                >
                  <span>MY PROFILE</span>
                </Button>
              ) : (
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block"
                  onClick={() => {
                    window.dispatchEvent(new Event('show-auth-dialog'));
                  }}
                >
                  <span>SIGN IN</span>
                </Button>
              )}
              <Button
                variant="text"
                size="sm"
                className="inline-block"
                onClick={() => {
                  window.dispatchEvent(new Event('cart-updated'));
                }}
              >
                <ShoppingBagIcon className="h-6 w-6" />
              </Button>
            </div>
            {/* Mobile: Menu Button */}
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                // Close Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Open Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        {/* Mobile: Opened Navigation Links */}
        <Collapse open={openNav}>
          {navList()}
          <div className="flex items-center gap-x-1">
            {/* User */}
            {isSignedIn ? (
              <Button
                fullWidth
                variant="text"
                size="sm"
                onClick={() => (window.location.href = '/profile')}
              >
                <span>MY PROFILE</span>
              </Button>
            ) : (
              <Button
                fullWidth
                variant="text"
                size="sm"
                onClick={() => {
                  window.dispatchEvent(new Event('show-auth-dialog'));
                }}
              >
                <span>SIGN IN</span>
              </Button>
            )}
          </div>
        </Collapse>
      </Navbar>
    </>
  );
}
