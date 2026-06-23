const bedrock = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER UNTUK RAILWAY
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Bedrock AFK sedang berjalan 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server aktif di port ${PORT}`);
});

// Variabel untuk mencegah bot berjalan ganda dan bertabrakan
let isBotRunning = false;
let reconnectTimeout = null;

// 2. KONFIGURASI BOT MINECRAFT BEDROCK
function createBot() {
    if (isBotRunning) return; 
    isBotRunning = true;
    
    console.log('Mencoba menghubungkan bot ke server Vanilla Bedrock...');
    
    const client = bedrock.createClient({
        host: '167.235.93.185',
        port: 53893,
        username: 'BotAFK',
        offline: true
    });

    let antiAfkInterval;

    client.on('spawn', () => {
        console.log('Bot berhasil masuk (spawn) ke server!');
        
        // SISTEM ANTI-AFK: Mengayunkan tangan setiap 10 detik
        antiAfkInterval = setInterval(() => {
            try {
                // Mengirim paket animasi ke server agar bot tidak dianggap mati/idle
                client.queue('animate', {
                    action_id: 1, // 1 = animasi mengayunkan tangan (swing arm)
                    entity_id: client.entityId
                });
            } catch (err) {
                // Abaikan error jika terputus saat mencoba mengayunkan tangan
            }
        }, 10000);
    });

    // Fitur auto-reconnect yang sudah diperbaiki
    client.on('close', () => {
        console.log('Bot terputus dari server. Mencoba masuk lagi dalam 15 detik...');
        
        isBotRunning = false;
        clearInterval(antiAfkInterval); // Hapus aktivitas tangan agar tidak bocor
        
        // Mencegah penumpukan proses reconnect
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(createBot, 15000);
    });

    client.on('error', (err) => {
        console.log('Terjadi error pada bot:', err.message);
        // Error biarkan ditangkap agar script tidak crash
    });
}

createBot();
