"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/category/affirmations/", label: "Wise Words" },
  { href: "/category/mindset/", label: "Mindset" },
  { href: "/about/", label: "About" },
];

function SocialLinks() {
  return (
    <div className="socials">
      <a href="https://www.facebook.com/seekwisdom.co" aria-label="Facebook">
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20,10.1c0-5.5-4.5-10-10-10S0,4.5,0,10.1c0,5,3.7,9.1,8.4,9.9v-7H5.9v-2.9h2.5V7.9C8.4,5.4,9.9,4,12.2,4c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L13.9,13h-2.3v7C16.3,19.2,20,15.1,20,10.1z"
          />
        </svg>
      </a>
      <a href="https://twitter.com/seekwisdom_co" aria-label="X (Twitter)">
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M2.9 0C1.3 0 0 1.3 0 2.9v14.3C0 18.7 1.3 20 2.9 20h14.3c1.6 0 2.9-1.3 2.9-2.9V2.9C20 1.3 18.7 0 17.1 0H2.9zm13.2 3.8L11.5 9l5.5 7.2h-4.3l-3.3-4.4-3.8 4.4H3.4l5-5.7-5.3-6.7h4.4l3 4 3.5-4h2.1zM14.4 15 6.8 5H5.6l7.7 10h1.1z"
          />
        </svg>
      </a>
      <a href="https://www.instagram.com/seekwisdom.co/" aria-label="Instagram">
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="3.3" fill="currentColor" />
          <path
            fill="currentColor"
            d="M14.2,0H5.8C2.6,0,0,2.6,0,5.8v8.3C0,17.4,2.6,20,5.8,20h8.3c3.2,0,5.8-2.6,5.8-5.8V5.8C20,2.6,17.4,0,14.2,0zM10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z M15.8,5C15.4,5,15,4.6,15,4.2s0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8S16.3,5,15.8,5z"
          />
        </svg>
      </a>
      <a href="#" aria-label="Pinterest">
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10,0C4.5,0,0,4.5,0,10c0,4.1,2.5,7.6,6,9.2c0-0.7,0-1.5,0.2-2.3c0.2-0.8,1.3-5.4,1.3-5.4s-0.3-0.6-0.3-1.6c0-1.5,0.9-2.6,1.9-2.6c0.9,0,1.3,0.7,1.3,1.5c0,0.9-0.6,2.3-0.9,3.5c-0.3,1.1,0.5,1.9,1.6,1.9c1.9,0,3.2-2.4,3.2-5.3c0-2.2-1.5-3.8-4.2-3.8c-3,0-4.9,2.3-4.9,4.8c0,0.9,0.3,1.5,0.7,2C6,12,6.1,12.1,6,12.4c0,0.2-0.2,0.6-0.2,0.8c-0.1,0.3-0.3,0.3-0.5,0.3c-1.4-0.6-2-2.1-2-3.8c0-2.8,2.4-6.2,7.1-6.2c3.8,0,6.3,2.8,6.3,5.7c0,3.9-2.2,6.9-5.4,6.9c-1.1,0-2.1-0.6-2.4-1.2c0,0-0.6,2.3-0.7,2.7c-0.2,0.8-0.6,1.5-1,2.1C8.1,19.9,9,20,10,20c5.5,0,10-4.5,10-10C20,4.5,15.5,0,10,0z"
          />
        </svg>
      </a>
      <a href="https://www.youtube.com/channel/UC93m-A_PRln3IPrSCq7YM8w" aria-label="YouTube">
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15,0H5C2.2,0,0,2.2,0,5v10c0,2.8,2.2,5,5,5h10c2.8,0,5-2.2,5-5V5C20,2.2,17.8,0,15,0z M14.5,10.9l-6.8,3.8c-0.1,0.1-0.3,0.1-0.5,0.1c-0.5,0-1-0.4-1-1l0,0V6.2c0-0.5,0.4-1,1-1c0.2,0,0.3,0,0.5,0.1l6.8,3.8c0.5,0.3,0.7,0.8,0.4,1.3C14.8,10.6,14.6,10.8,14.5,10.9z"
          />
        </svg>
      </a>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.8,13.7L12,11c0.9-1.2,1.5-2.6,1.5-4.2c0-3.7-3-6.8-6.8-6.8S0,3,0,6.8s3,6.8,6.8,6.8c1.6,0,3.1-0.6,4.2-1.5l2.8,2.8c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2C15.1,14.5,15.1,14,14.8,13.7z M1.5,6.8c0-2.9,2.4-5.2,5.2-5.2S12,3.9,12,6.8S9.6,12,6.8,12S1.5,9.6,1.5,6.8z"
      />
    </svg>
  );
}

export function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label={name}>
          <Image src="/logo.png" alt={name} width={462} height={166} priority />
        </Link>
        <nav className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Main Menu">
          {NAV.map((item) => {
            const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="header-tools">
          <SocialLinks />
          <button
            className="icon-button search-toggle"
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((value) => !value)}
          >
            <SearchIcon />
          </button>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              <rect y="0" width="18" height="1.7" rx="1" fill="currentColor" />
              <rect y="6.15" width="18" height="1.7" rx="1" fill="currentColor" />
              <rect y="12.3" width="18" height="1.7" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
        <form
          className={searchOpen ? "header-search search-form is-open" : "header-search search-form"}
          action="/"
          method="get"
          role="search"
        >
          <label className="sr-only" htmlFor="header-search">
            Search
          </label>
          <input id="header-search" type="search" name="s" placeholder="Search" />
          <button type="submit" aria-label="Search button">
            <SearchIcon />
          </button>
        </form>
      </div>
    </header>
  );
}

export function FooterSocials() {
  return <SocialLinks />;
}

export function FooterNav() {
  const pathname = usePathname();
  return (
    <nav className="footer-nav" aria-label="Footer">
      {NAV.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
