const bedrock = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER UNTUK RENDER (Wajib agar Render tidak menganggap bot mati/timeout)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Bedrock AFK sedang berjalan secara 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server aktif di port ${PORT}`);
});

// 2. KONFIGURASI BOT MINECRAFT BEDROCK
function createBot() {
    console.log('Mencoba menghubungkan bot ke server Bedrock...');
    
    const client = bedrock.createClient({
        host: '167.235.93.185',  // IP Server kamu
        port: 53893,             // Port server kamu
        username: 'BotAFK',      // Kamu bisa ganti nama bot ini bebas
        offline: true            // Setel true agar bisa masuk tanpa verifikasi akun Xbox premium
    });

    client.on('spawn', () => {
        console.log('Bot Bedrock berhasil masuk (spawn) ke server!');
    });

    client.on('text', (packet) => {
        // Log ini akan muncul di dashboard Render agar kamu bisa memantau chat server
        console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
    });

    // Fitur auto-reconnect: jika server restart atau bot ter-kick, bot akan login lagi otomatis
    client.on('close', () => {
        console.log('Bot terputus dari server Bedrock. Mencoba masuk lagi dalam 15 detik...');
        setTimeout(createBot, 15000);
    });

    client.on('error', (err) => {
        console.log('Terjadi error pada bot Bedrock:', err.message);
    });
}

createBot();