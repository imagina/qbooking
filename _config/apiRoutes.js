const moduleName = 'ibooking';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`;


export default {
  urlBase: urlBase,
  version: moduleVersion,
  categories: `${urlBase}/categories`,
  services: `${urlBase}/services`,
  resources: `${urlBase}/resources`,
  reservations: `${urlBase}/reservations`,
  reservationItems: `${urlBase}/reservation-items`,
  availabilities: `${urlBase}/availabilities`,
  statuses: `${urlBase}/statuses`,
  resourceValueTypes: `${urlBase}/resource-value-types`
};
