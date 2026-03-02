require('dotenv').config();
const { Event } = require('./src/models');

async function run() {
    try {
        const deleted = await Event.destroy({ where: { title: 'Retiro Paroquial de Jovens' } });
        console.log(`Deletados: ${deleted} eventos.`);
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
    } finally {
        process.exit(0);
    }
}

run();
