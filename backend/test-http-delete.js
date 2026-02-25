async function testHttpDelete() {
    try {
        // 1. Get token
        let res = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '123' })
        });

        if (!res.ok) {
            console.log('Login failed:', await res.text());
            return;
        }
        const data = await res.json();
        const token = data.token;

        // 2. Fetch a news item so we have an ID
        res = await fetch('http://127.0.0.1:3000/api/public/news');
        const newsList = await res.json();
        if (!newsList || newsList.length === 0) {
            console.log('No news items found to delete.');
            return;
        }
        const targetId = newsList[0].id;
        console.log('Target news ID to delete:', targetId);

        // 3. Delete it
        res = await fetch(`http://127.0.0.1:3000/api/news/${targetId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Delete status:', res.status);
        console.log('Delete response:', await res.text());

    } catch (err) {
        console.error('Test error:', err);
    }
}

testHttpDelete();
