// Contact form settings. The form on /contact/ posts to Web3Forms, which
// emails each enquiry to the address the access key was created with.
//
// To connect it: create a free access key at https://web3forms.com using
// James@manual-focus.co.uk, then paste the key between the quotes below.
// The key is public by design (it only routes submissions to that inbox),
// so it is safe to commit. Until it is set, the form shows its error
// state with the fallback email address.
export const WEB3FORMS_ACCESS_KEY = '0de94423-2c30-40a3-9006-bf4c0b455fc7';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// Shown on /contact/ only, as a fallback for when the form fails.
export const CONTACT_EMAIL = 'James@manual-focus.co.uk';
