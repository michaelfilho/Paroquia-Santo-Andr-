const { News } = require('./src/models');

async function testDelete() {
    try {
        const newsItem = await News.findOne();
        if (newsItem) {
            console.log('Found news ID:', newsItem.id);
            await newsItem.destroy();
            console.log('Deleted successfully');
        } else {
            console.log('No news found to delete');
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
}

testDelete();
