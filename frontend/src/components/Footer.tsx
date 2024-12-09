import { NavLink } from 'react-router-dom';

function Footer() {
  const icons = [
    {
      src: '/icons/instagram.svg',
      alt: 'Instagram',
      url: 'https://www.instagram.com/',
    },
    { src: '/icons/tiktok.svg', alt: 'TikTok', url: 'https://www.tiktok.com/' },
    { src: '/icons/twitter.svg', alt: 'Twitter', url: 'https://twitter.com/' },
    {
      src: '/icons/facebook.svg',
      alt: 'Facebook',
      url: 'https://www.facebook.com/',
    },
  ];

  const links = [
    { name: 'ABOUT US', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
  ];

  return (
    <footer className="flex flex-col md:flex-row justify-between items-center py-6 md:py-8 px-4 md:px-16 bg-white text-black mt-16 gap-6 md:gap-0">
      <div className="flex items-center space-x-6 md:space-x-8">
        {links.map((link) => (
          <NavLink key={link.name} to={link.path} className="text-sm md:text-base">
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        {icons.map((icon) => (
          <a
            key={icon.alt}
            href={icon.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={icon.src} alt={icon.alt} className="h-5 w-5 md:h-6 md:w-6" />
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
