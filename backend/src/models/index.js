const Admin = require('./Admin');
const Event = require('./Event');
const Chapel = require('./Chapel');
const ClergyMember = require('./ClergyMember');
const Guide = require('./Guide');
const Inscription = require('./Inscription');
const ContentText = require('./ContentText');
const EventPhoto = require('./EventPhoto');
const PastoralMovement = require('./pastoralmovement');
const FormerPriest = require('./formerpriest');
const News = require('./news');
const CarouselItem = require('./carouselitem');
const Schedule = require('./Schedule');
const History = require('./history');
const PrayerRequest = require('./PrayerRequest');
const RegistrationLink = require('./RegistrationLink');

// Define relationships
Event.hasMany(EventPhoto, { foreignKey: 'eventId', as: 'photos' });
EventPhoto.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  Admin,
  Event,
  Chapel,
  ClergyMember,
  Guide,
  Inscription,
  ContentText,
  EventPhoto,
  PastoralMovement,
  FormerPriest,
  News,
  CarouselItem,
  Schedule,
  History,
  PrayerRequest,
  RegistrationLink
};
