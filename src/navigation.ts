import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Services',
      links: [
        {
          text: 'General Contractor',
          href: getPermalink('/general-contractor'),
        },
        {
          text: 'Structural Construction',
          href: getPermalink('/structural-construction'),
        },
        {
          text: 'Concrete Services',
          href: getPermalink('/concrete'),
        },
      ],
    },
    {
      text: 'Other Services',
      links: [
        {
          text: 'Helical Pile Installation',
          href: getPermalink('/helical-piles'),
        },
        {
          text: 'Foundation Repair',
          href: getPermalink('/foundation-repair'),
        },
        {
          text: 'Concrete Raising & Polishing',
          href: getPermalink('/concrete-raising'),
        },
        {
          text: 'Spray Foam Insulation',
          href: getPermalink('/spray-foam-insulation'),
        },
        {
          text: 'Soil Stabilization',
          href: getPermalink('/soil-stabilization'),
        },
      ],
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: '(307) 660-3011', href: 'tel:+13076603011', icon: 'tabler:phone' }],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'General Contractor', href: getPermalink('/general-contractor') },
        { text: 'Structural Construction', href: getPermalink('/structural-construction') },
        { text: 'Concrete Services', href: getPermalink('/concrete') },
      ],
    },
    {
      title: 'Other Services',
      links: [
        { text: 'Helical Pile Installation', href: getPermalink('/helical-piles') },
        { text: 'Foundation Repair', href: getPermalink('/foundation-repair') },
        { text: 'Concrete Raising & Polishing', href: getPermalink('/concrete-raising') },
        { text: 'Spray Foam Insulation', href: getPermalink('/spray-foam-insulation') },
        { text: 'Soil Stabilization', href: getPermalink('/soil-stabilization') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Services', href: getPermalink('/#services') },
      ],
    },
    {
      title: 'Contact Info',
      links: [
        { text: 'Call (307) 660-3011', href: 'tel:+13076603011' },
        { text: 'Serving Gillette & Northeast Wyoming', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/Aden-Enterprises-LLC-110589294100062' },
  ],
  footNote: `
    © ${new Date().getFullYear()} Aden Enterprises, LLC. All rights reserved. · Designed by <a class="text-blue-600 underline dark:text-muted" href="https://prairiegiraffe.com" target="_blank">Prairie Giraffe</a>
  `,
};
