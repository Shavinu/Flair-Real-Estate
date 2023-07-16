import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _postTitles,
  _firstNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
} from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index) => _id[index],
  boolean: (index) => _booleans[index],
  role: (index) => _roles[index],
  // Text
  taskNames: (index) => _taskNames[index],
  postTitle: (index) => _postTitles[index],
  jobTitle: (index) => _jobTitles[index],
  tourName: (index) => _tourNames[index],
  productName: (index) => _productNames[index],
  sentence: (index) => _sentences[index],
  description: (index) => _descriptions[index],
  // Contact
  email: (index) => _emails[index],
  phoneNumber: (index) => _phoneNumbers[index],
  fullAddress: (index) => _fullAddress[index],
  // Name
  firstName: (index) => _firstNames[index],
  lastName: (index) => _lastNames[index],
  fullName: (index) => _fullNames[index],
  companyName: (index) => _companyNames[index],
  // Number
  number: {
    percent: (index) => _percents[index],
    rating: (index) => _ratings[index],
    age: (index) => _ages[index],
    price: (index) => _prices[index],
    nativeS: (index) => _nativeS[index],
    nativeM: (index) => _nativeM[index],
    nativeL: (index) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_${index + 1}.jpg`,
    avatar: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${index + 1}.jpg`,
    travel: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/travel/travel_${index + 1}.jpg`,
    company: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/company/company_${index + 1}.png`,
    product: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/m_product/product_${index + 1}.jpg`,
    portrait: (index) => `https://api-dev-minimal-v510.vercel.app/assets/images/portrait/portrait_${index + 1}.jpg`,
  },
};
