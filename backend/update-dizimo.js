const db = require('./src/models');

async function run() {
    try {
        const config = {
            pixKey: 'parsanat@hotmail.com',
            whatsappUrl: 'https://wa.me/5518997994927',
            quote: '"Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."',
            quoteRef: '(2 Coríntios 9:7)',
            bankName: 'SICOOB - CREDIMOTA',
            agency: '3190',
            account: '32.586-4',
            holder: 'Paróquia Santo André - Tarumã/SP',
            cnpj: '44.375.186/0032-35'
        };

        // Ensure we can query
        const content = await db.Content.findOne({ where: { key: 'dizimo_config' } });
        if (content) {
            await db.Content.update({ content: JSON.stringify(config) }, { where: { key: 'dizimo_config' } });
            console.log('Updated existing config.');
        } else {
            await db.Content.create({
                key: 'dizimo_config',
                title: 'Dízimo - Configuração',
                content: JSON.stringify(config)
            });
            console.log('Created new config.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
