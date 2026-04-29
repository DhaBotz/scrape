const axios = require("axios");

async function handler(sock, msg) {

    const from = msg.key.remoteJid;

    const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

    if (!text) return;

    const cmd = text.toLowerCase();

    // MENU
    if (cmd === ".menu") {
        return sock.sendMessage(from, {
            text: `📌 MENU SCRAPER BOT

.ig username
→ info instagram

.tiktok link
→ info tiktok

.quote
→ quotes random

.cek
→ test API`
        });
    }

    // QUOTES RANDOM
    if (cmd === ".quote") {
        try {
            const res = await axios.get("https://api.quotable.io/random");
            return sock.sendMessage(from, {
                text: `📜 QUOTE

"${res.data.content}"
- ${res.data.author}`
            });
        } catch {
            return sock.sendMessage(from, { text: "❌ gagal ambil quote" });
        }
    }

    // INSTAGRAM SCRAPE (basic API)
    if (cmd.startsWith(".ig")) {
        const user = text.split(" ")[1];

        if (!user) {
            return sock.sendMessage(from, { text: "Contoh: .ig instagram" });
        }

        try {
            const res = await axios.get(`https://api.popcat.xyz/instagram?user=${user}`);

            return sock.sendMessage(from, {
                text: `📸 INSTAGRAM

👤 ${res.data.username}
📝 ${res.data.bio}
👥 Followers: ${res.data.followers}
📌 Following: ${res.data.following}`
            });

        } catch {
            return sock.sendMessage(from, { text: "❌ gagal ambil data IG" });
        }
    }

    // TIKTOK SCRAPE
    if (cmd.startsWith(".tiktok")) {
        const url = text.split(" ")[1];

        if (!url) {
            return sock.sendMessage(from, { text: "Contoh: .tiktok https://tiktok.com/..." });
        }

        try {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${url}`);

            return sock.sendMessage(from, {
                text: `🎵 TIKTOK

👤 ${res.data.author}
📝 ${res.data.title}
❤️ Likes: ${res.data.stats.likes}
💬 Comments: ${res.data.stats.comments}`
            });

        } catch {
            return sock.sendMessage(from, { text: "❌ gagal ambil TikTok" });
        }
    }

    // TEST SCRAPE
    if (cmd === ".cek") {
        try {
            const res = await axios.get("https://api.github.com");

            return sock.sendMessage(from, {
                text: `✅ API OK

Current User URL:
${res.data.current_user_url}`
            });
        } catch {
            return sock.sendMessage(from, { text: "❌ API error" });
        }
    }
}

module.exports = handler;
