const db = require('./src/models');

async function run() {
    try {
        const content = await db.Content.findOne({ where: { key: 'brasao' } });
        if (content) {
            let parsed = JSON.parse(content.content);
            // Sometimes the content is just a string, sometimes its a JSON with title. Wait, 'title' is a column in the Contents table!
            await db.Content.update({ title: 'Brasão Paroquial' }, { where: { key: 'brasao' } });
            console.log('Updated title.');
        } else {
            console.log('Not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
