const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const handler = require("./handler");

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        printQRInTerminal: true // ✅ QR langsung di terminal
    });

    // simpan session
    sock.ev.on("creds.update", saveCreds);

    // connection handler
    sock.ev.on("connection.update", (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("✅ BOT CONNECTED");
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;

            console.log("❌ DISCONNECTED:", reason);

            if (reason !== DisconnectReason.loggedOut) {
                console.log("🔄 Reconnecting...");
                startBot();
            } else {
                console.log("❌ Session logout, hapus folder session");
            }
        }
    });

    // pesan masuk
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        await handler(sock, msg);
    });
}

startBot();
