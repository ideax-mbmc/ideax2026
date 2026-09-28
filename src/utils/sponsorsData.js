// ──────────────────────────────────────────────────
// Marquee 1 — Silver / Bronze  (everything scrolls)
// ──────────────────────────────────────────────────
export const SILVER_BRONZE = [
  { tier: 'Silver Sponsor', sponsors: [
    { name: 'Ultima', file: 'ultima.png', url: 'https://ultima.com.np' },
  ]},
  { tier: 'Bronze Sponsor', sponsors: [
    { name: 'IME Pay',       file: 'ime-new-logo.png', url: 'https://khalti.com/' },
    { name: 'IME Group',     file: 'ime-group.png',    url: 'https://imegroup.com.np' },
    { name: 'Nepal Telecom', file: 'nepal-telecom.jpg', url: 'https://www.ntc.net.np' },
  ]},
]

// ──────────────────────────────────────────────────
// Marquee 2 — Associate Partners  (label fixed, logos scroll)
// ──────────────────────────────────────────────────
export const ASSOCIATE_PARTNERS = [
  { name: 'i-CES',                      file: 'i-ces.png',           url: 'https://ices.edu.np/' },
  { name: 'CSIT Association Rupandehi', file: 'csit-rupandehi.png',  url: 'https://rupandehi.csitan.org.np/' },
  { name: 'Gupta Ji',                   file: 'gupta-ji-yt.png',      url: 'https://www.guptatutorial.com/' },
  { name: 'Hamro CSIT',                 file: 'hamro-csit.png',       url: 'https://hamrocsit.com' },
]

// ──────────────────────────────────────────────────
// Marquee 3 — Official Partners by role  (logo + role scrolls)
// ──────────────────────────────────────────────────
export const OFFICIAL_PARTNERS = [
  { name: 'Ultima Lifestyle', file: 'ultima.png',                role: 'Gadget Partner',                                    url: 'https://ultima.com.np' },
  { name: 'Royal Shoes',      file: 'royal-shoes.png',           role: 'Shoe Partner',                                      url: 'https://www.royalshoesnepal.com' },
  { name: 'IME Limited',      file: 'ime-new-logo.png',          role: 'Strategic Innovation & Entrepreneurship Partner',   url: 'https://khalti.com/' },
  { name: 'NTC',              file: 'nepal-telecom.jpg',         role: 'Telecommunication Partner',                         url: 'https://www.ntc.net.np' },
  { name: 'LeadX Nepal',      file: 'leadx-gifting-partner.png', role: 'Gifting Partner',                                   url: 'https://leadxnepal.com' },
  { name: 'Bennevis',         file: 'bennevis.png',              role: 'Dessert Partner',                                   url: 'https://www.facebook.com/bennevis.care' },
  { name: 'TechAxis',         file: 'techaxis.png',              role: 'Official Training & Internship Partner',            url: 'https://techaxis.com.np' },
  { name: 'Kailash Cloud',    file: 'kailash-cloud.png',         role: 'Official Hosting Partner',                          url: 'https://www.kailashcloud.com' },
  { name: 'Leapfrog Connect', file: 'leapfrog-connect.png',      role: 'Official Talent, Technology & Innovation Partner',  url: 'https://leapfrogconnect.co' },
]

// Legacy flat list (kept for backward compat if needed)
export const SPONSORS = [
  ...SILVER_BRONZE.flatMap(g => g.sponsors),
  ...ASSOCIATE_PARTNERS,
  ...OFFICIAL_PARTNERS,
]
