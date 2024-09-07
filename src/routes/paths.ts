const signIn = `/sign-in`;
const signUp = `/sign-up`;
const resetPassword = `/reset-password`;
const updatePassword = `/update-password`;
const verify = `/verify`;

const app = `/app`;

const tourPlan = `/tour`;
const itinerary = `/itinerary`;
const quotation = `/quotation`;

const edit = `/edit`;

const faqs = `/faqs`;

export const paths = {
  faqs: `${faqs}`,
  // AUTH
  auth: {
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    verify,
  },
  // APP
  app: {
    root: app,
    settings: {
      userSettings: `${app}/settings/user-settings`,
      organizationSettings: `${app}/settings/organization-settings`,
    },
    tourPlan: {
      home: `${app}${tourPlan}`,
      new: `${app}${tourPlan}/new`,
      details: (id: string) => `${app}${tourPlan}/${id}`,
      edit: (id: string) => `${app}${tourPlan}/${id}${edit}`,
    },
    itinerary: {
      home: `${app}${itinerary}`,
      details: (id: string) => `${app}${itinerary}/${id}`,
      edit: (id: string) => `${app}${itinerary}/${id}${edit}`,
    },
    quotation: {
      home: `${app}${quotation}`,
      details: (id: string) => `${app}${quotation}/${id}`,
      edit: (id: string) => `${app}${quotation}/${id}${edit}`,
    },
  },
};
