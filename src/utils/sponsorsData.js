<<<<<<< HEAD
// Marquee 1: Silver & Bronze Tiers (labels and logos flow together)
export const TIER_MARQUEE_ITEMS = [
  { type: 'label', tier: 'silver', label: 'Silver Sponsor' },
  {
    type: 'sponsor',
    name: 'Ultima',
    file: 'ultima.png',
    url: 'https://www.ultima.com.np/'
  },
  { type: 'label', tier: 'bronze', label: 'Bronze Sponsor' },
  {
    type: 'sponsor',
    name: 'IME',
    file: 'ime-new-logo.png',
    url: 'https://khalti.com/'
  },
  {
    type: 'sponsor',
    name: 'IME Group',
    file: 'ime-group.png',
    url: 'https://imegroup.com.np/'
  },
  {
    type: 'sponsor',
    name: 'Nepal Telecom',
    file: 'nepal-telecom.jpg',
    url: 'https://www.ntc.net.np/'
  }
]

// Marquee 2: Associate Partners (fixed label on side, logos scroll)
export const ASSOCIATE_PARTNERS = [
  {
    name: 'Hamro CSIT',
    file: 'hamro-csit.png',
    url: 'https://hamrocsit.com/'
  },
  {
    name: 'i-CES',
    file: 'i-ces.png',
    url: 'https://ices.edu.np/'
  },
  {
    name: 'CSIT Association Rupandehi',
    file: 'csit-rupandehi.png',
    url: 'https://rupandehi.csitan.org.np/'
  },
  {
    name: 'Gupta Ji',
    file: 'gupta-ji-yt.png',
    url: 'https://www.guptatutorial.com/'
  }
]

// Marquee 3: Official Partners by Role (logo + role title, no sponsor names)
export const ROLE_PARTNERS = [
  {
    name: 'Bennevis',
    file: 'bennevis.png',
    role: 'Dessert Partner',
    url: 'https://www.bennevisicecream.com/'
  },
  {
    name: 'TechAxis',
    file: 'techaxis.png',
    role: 'Training & Internship Partner',
    url: 'https://techaxis.com.np/'
  },
  {
    name: 'Kailash Cloud',
    file: 'kailash-cloud.png',
    role: 'Hosting Partner',
    url: 'https://kailashcloud.com/'
  },
  {
    name: 'Leapfrog Connect',
    file: 'leapfrog-connect.png',
    role: 'Talent, Technology & Innovation Partner',
    url: 'https://www.lftechnology.com/'
  },
  {
    name: 'Ultima Lifestyle',
    file: 'ultima.png',
    role: 'Gadget Partner',
    url: 'https://www.ultima.com.np/'
  },
  {
    name: 'Royal Shoes',
    file: 'royal-shoes.png',
    role: 'Shoe Partner',
    url: 'https://royalshoesnepal.com/'
  },
  {
    name: 'IME Limited',
    file: 'ime-new-logo.png',
    role: 'Strategic Innovation & Entrepreneurship Partner',
    url: 'https://khalti.com/'
  },
  {
    name: 'NTC',
    file: 'nepal-telecom.jpg',
    role: 'Telecommunication Partner',
    url: 'https://www.ntc.net.np/'
  },
  {
    name: 'LeadX Nepal',
    file: 'leadx-gifting-partner.png',
    role: 'Gifting Partner',
    url: 'https://leadxnepal.com/'
  }
]

// Backward compatibility export
export const SPONSORS = [
  ...TIER_MARQUEE_ITEMS.filter((item) => item.type === 'sponsor'),
  ...ASSOCIATE_PARTNERS,
  ...ROLE_PARTNERS
=======
export const SPONSORS = [
  { name: 'Hamro CSIT', file: 'hamro-csit.png' },
  { name: 'i-CES', file: 'i-ces.png' },
  { name: 'Bennevis', file: 'bennevis.png' },
  { name: 'CSIT Association Rupandehi', file: 'csit-rupandehi.png' },
  { name: 'Gupta Ji', file: 'gupta-ji-yt.png' },
  { name: 'IME', file: 'ime-new-logo.png' },
  { name: 'Leapfrog Connect', file: 'leapfrog-connect.png' },
  { name: 'LeadX (Gifting Partner)', file: 'leadx-gifting-partner.png' },
  { name: 'Nepal Telecom', file: 'nepal-telecom.jpg' },
  { name: 'IME Group', file: 'ime-group.png' },
  { name: 'Ultima', file: 'ultima.png' }
>>>>>>> origin/main
]
