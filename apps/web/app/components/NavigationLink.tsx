"use client";

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isSpecial?: boolean;
}

const NavigationLink = ({ href, children, className = "", isSpecial = false }: NavigationLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkClasses = isSpecial
    ? 'bg-vidwanic-orange text-white px-4 py-2 rounded-full hover:bg-vidwanic-orange-hover font-semibold transition-colors duration-200'
    : 'text-gray-600 hover:text-gray-900 transition-colors duration-200';

  return (
    <a
      href={href}
      className={`${linkClasses} ${className}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default NavigationLink;