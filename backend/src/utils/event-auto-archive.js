const { Event } = require('../models');

/**
 * Auto-archive events that have passed
 * When a programação (missa) date passes, it's moved to eventos (isActive = false)
 * and keeps published status so it can be manually controlled
 */
const autoArchiveExpiredEvents = async () => {
  try {
    const now = new Date();
    
    // Find active events with past dates
    const expiredEvents = await Event.findAll({
      where: {
        isActive: true,
      },
    });

    // Filter events that are in the past
    const eventsToArchive = expiredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < now;
    });

    if (eventsToArchive.length === 0) {
      return { archived: 0, message: 'Nenhum evento para arquivar' };
    }

    // Archive all expired events
    // Keep published status, just mark as inactive
    const results = await Promise.all(
      eventsToArchive.map((event) =>
        event.update({ 
          isActive: false,
          // published stays as is - if it was published, stays published
          // if it wasn't, stays unpublished
        })
      )
    );

    console.log(`✅ ${results.length} evento(s) movido(s) para arquivo`);
    return {
      archived: results.length,
      events: results.map((e) => ({ id: e.id, title: e.title, date: e.date, published: e.published })),
    };
  } catch (error) {
    console.error('❌ Erro ao arquivar eventos expirados:', error.message);
    throw error;
  }
};

module.exports = {
  autoArchiveExpiredEvents,
};
