// ──────────────────────────────────────────────────
// Marquee 1 — Silver / Bronze Sponsors  (everything scrolls)
// ──────────────────────────────────────────────────
export const SILVER_BRONZE = [
  { tier: 'Silver Sponsor', sponsors: [
    { name: 'Ultima Lifestyle', file: 'ultima.png', url: 'https://ultima.com.np' },
  ]},
  { tier: 'Bronze Sponsor', sponsors: [
    { name: 'NTC',                     file: 'nepal-telecom.jpg',       url: 'https://www.ntc.net.np' },
    { name: 'IME Limited',             file: 'ime-new-logo.png',        url: 'https://imeremit.com.np/' },
    { name: 'Aashrit Travellerstouch', file: 'aashrit-travels.jpg',     url: 'https://www.facebook.com/p/Aashrit-Travellers-Touch-Pvt-Ltd-61576759733394/' },
    { name: 'Leapfrog Technology',     file: 'leapfrog-technology.svg', url: 'https://www.lftechnology.com/' },
    { name: 'Burrst Neembu Fizz',      file: 'burst-neembu-fizz.png',   url: 'https://www.facebook.com/burrst.np/' },
    { name: 'Debug Soft',              file: 'debug-dark.png',          url: 'https://www.dibugsoft.com/' },
    { name: 'Global Stationary',       file: 'global-stationery.svg',   url: '#' },
  ]},
]

// ──────────────────────────────────────────────────
// Marquee 2 — Associate Partners / Sponsors  (label fixed, logos scroll)
// ──────────────────────────────────────────────────
export const ASSOCIATE_PARTNERS = [
  { name: 'Leapfrog Connect', file: 'leapfrog-connect.png', url: 'https://leapfrogconnect.co' },
  { name: 'Royal Shoes',      file: 'royal-shoes.svg',      url: 'https://www.royalshoesnepal.com' },
  { name: 'Alish Stationery', file: 'alish-stationary.jpg', url: '#' },
  { name: 'i-CES',            file: 'i-ces.png',            url: 'https://ices.edu.np/' },
]

// ──────────────────────────────────────────────────
// Marquee — Community Partners  (label fixed, logos scroll)
// ──────────────────────────────────────────────────
export const COMMUNITY_PARTNERS = [
  { name: 'Gupta Ji',                   file: 'gupta-ji.png',                 url: 'https://www.guptatutorial.com/' },
  { name: 'Hamro CSIT',                 file: 'hamro-csit-new.jpg',           url: 'https://hamrocsit.com' },
  { name: 'CSIT Association Rupandehi', file: 'csit-rupandehi-community.jpg', url: 'https://rupandehi.csitan.org.np/' },
  { name: 'PK IT Club',                 file: 'pk-it-club.jpg',               url: 'https://www.nepvents.com/organizations/pk-it-club' },
  { name: 'Nagarjuna ICT Club',         file: 'nagarjuna-ict-club.jpg',       url: '#' },
  { name: 'Kathmandu University Robotics', file: 'kurc.png',                  url: 'https://kurc.ku.edu.np/' },
  { name: 'CSITAN Pokhara',             file: 'csitan-pokhara.png',           url: 'https://pokhara.csitan.org.np/' },
  { name: 'CSIT Association BMC',       file: 'csit-bmc.png',                 url: 'https://www.csitabmc.com/' },
]

// ──────────────────────────────────────────────────
// Marquee 3 — Official Partners by role  (logo + role scrolls)
// ──────────────────────────────────────────────────
export const OFFICIAL_PARTNERS = [
  { name: 'Ultima Lifestyle',        file: 'ultima.png',              role: 'Gadget Partner',                                    url: 'https://ultima.com.np' },
  { name: 'Royal Shoes',             file: 'royal-shoes.svg',         role: 'Footwear Partner',                                  url: 'https://www.royalshoesnepal.com' },
  { name: 'IME Limited',             file: 'ime-new-logo.png',        role: 'Strategic Innovation & Entrepreneurship Partner',   url: 'https://imeremit.com.np/' },
  { name: 'NTC',                     file: 'nepal-telecom.jpg',       role: 'Official Telecom Partner',                          url: 'https://www.ntc.net.np' },
  { name: 'Aashrit Travellerstouch', file: 'aashrit-travels.jpg',     role: 'Travel & Tourism Partner',                          url: 'https://www.facebook.com/p/Aashrit-Travellers-Touch-Pvt-Ltd-61576759733394/' },
  { name: 'Leapfrog Technology',     file: 'leapfrog-technology.svg', role: 'Strategic Innovation Partner',                      url: 'https://www.lftechnology.com/' },
  { name: 'Burrst Neembu Fizz',      file: 'burst-neembu-fizz.png',   role: 'Refreshment Partner',                               url: 'https://www.facebook.com/burrst.np/' },
  { name: 'LeadX Nepal',             file: 'leadx-gifting-partner.png', role: 'Gifting Partner',                                 url: 'https://leadxnepal.com' },
  { name: 'Bennevis',                file: 'bennevis.png',            role: 'Official Dessert Partner',                          url: 'https://www.bennevisicecream.com/' },
  { name: 'TechAxis',                file: 'techaxis.png',            role: 'Official Training & Internship Partner',            url: 'https://techaxis.com.np' },
  { name: 'Kailash Cloud',           file: 'kailash-cloud.png',       role: 'Official Hosting Partner',                          url: 'https://www.kailashcloud.com' },
  { name: 'Dlytica',                 file: 'dlytica.png',             role: 'Official Strategic Data & AI Innovation Partner',    url: 'https://dlytica.com/' },
  { name: 'Venus Hospital',          file: 'venus-hospital.png',      role: 'Health Partner (Mid Baneshwor)',                    url: 'https://venushospital.com.np/' },
  { name: 'Leapfrog Connect',        file: 'leapfrog-connect.png',    role: 'Official Talent, Technology & Innovation Partner',  url: 'https://leapfrogconnect.co' },
  { name: 'Radio Shweta Shardul',    file: 'radio-shweta-shardul.svg', role: 'Media Partner (93.6 MHz)',                          url: 'https://radioshwetashardul.org/' },
]

// Legacy flat list (kept for backward compat if needed)
export const SPONSORS = [
  ...SILVER_BRONZE.flatMap(g => g.sponsors),
  ...ASSOCIATE_PARTNERS,
  ...COMMUNITY_PARTNERS,
  ...OFFICIAL_PARTNERS,
]
