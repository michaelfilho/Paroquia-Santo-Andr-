const Admin = require('./Admin');
const Event = require('./Event');
const Chapel = require('./Chapel');
const ClergyMember = require('./ClergyMember');
const Guide = require('./Guide');
const Inscription = require('./Inscription');
const ContentText = require('./ContentText');
const EventPhoto = require('./EventPhoto');

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
};
