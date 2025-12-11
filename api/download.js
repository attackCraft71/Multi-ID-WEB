// api/download.js
// FINAL VERSION: ALL-IN-ONE (YouTube + Music + Sosmed)
// RECODE BY: V-tihX

export default async function handler(req, res) {
    // 1. Set Headers (CORS & Cache)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');

    // 2. Ambil Parameter
    const { type, url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL Missing' });
    }

    try {
        let result = null;

        // ==========================================
        // 🟥 SEKTOR YOUTUBE (COBALT API)
        // ==========================================
        if (type === 'ytmp3' || type === 'ytmp4' || type === 'ytmp3v2' || type === 'youtube') {
            
            // Tentukan Mode
            // Kalau requestnya 'ytmp3' atau 'ytmp3v2', berarti audio only
            const isAudio = (type === 'ytmp3' || type === 'ytmp3v2');
            
            const cobaltConfig = {
                url: url,
                vCodec: "h264",
                vQuality: "720",
                aFormat: "mp3",
                isAudioOnly: isAudio
            };

            const response = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                body: JSON.stringify(cobaltConfig)
            });

            const data = await response.json();

            if (data.url) {
                result = {
                    success: true, // Label 'success' biar kebaca di HTML lama
                    data: {
                        title: "YouTube Content (Cobalt)", 
                        thumbnail: "https://i.imgur.com/6jX6z5D.png", // Placeholder
                        duration: 0, // Bypass limit durasi frontend
                        download_url: data.url
                    }
                };
            } else {
                // Fallback kalau Cobalt gagal (misal konten sensitif), coba Zenzxz
                // (Opsi tambahan biar makin kuat)
                throw new Error("Cobalt gagal mengambil data.");
            }
        } 

        // ==========================================
        // 🎵 SEKTOR YOUTUBE MUSIC (NEW)
        // ==========================================
        else if (type === 'ytmusic') {
            const cleanUrl = url.split('&')[0]; 
            const apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(cleanUrl)}&format=320k`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 200 && data.result) {
                result = {
                    success: true,
                    data: {
                        title: data.result.title || "YouTube Music Audio",
                        artist: data.result.channel || "Unknown Artist",
                        image: data.result.thumb,
                        download_url: data.result.download_url || data.result.best_quality_url
                    }
                };
            }
        }

        // ==========================================
        // 🟢 SEKTOR SPOTIFY (Vreden - Auto Convert)
        // ==========================================
        else if (type === 'spotify') {
            const response = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (data.result) {
                result = {
                    success: true,
                    data: {
                        title: data.result.title,
                        artist: data.result.artists,
                        image: data.result.cover_url,
                        download_url: data.result.music_url || data.result.download_url
                    }
                };
            }
        }

        // ==========================================
        // 🍎 SEKTOR APPLE MUSIC
        // ==========================================
        else if (type === 'apple' || type === 'applemusic') {
            const response = await fetch(`https://api.delirius.store/download/applemusicdl?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (data.status && data.data) {
                result = {
                    success: true,
                    data: {
                        title: data.data.name,
                        artist: data.data.artists,
                        image: data.data.image,
                        download_url: data.data.download
                    }
                };
            }
        }

        // ==========================================
        // 🟠 SEKTOR SOUNDCLOUD
        // ==========================================
        else if (type === 'soundcloud') {
            const response = await fetch(`https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (data.status && data.data) {
                result = {
                    success: true,
                    data: {
                        title: data.data.title,
                        artist: data.data.author,
                        image: data.data.image,
                        download_url: data.data.download
                    }
                };
            }
        }

        // ==========================================
        // ⬛ SEKTOR TIKTOK (DELIRIUS)
        // ==========================================
        else if (type === 'tiktok') {
            const response = await fetch(`https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if(data.status) result = data; 
        }

        // ==========================================
        // 🟪 SEKTOR IG, FB, TWITTER
        // ==========================================
        else if (type === 'ig' || type === 'instagram') {
            const response = await fetch(`https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            result = data;
        }
        else if (type === 'fb' || type === 'facebook') {
            const response = await fetch(`https://api.delirius.store/download/facebook?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            result = data;
        }
        else if (type === 'twitter' || type === 'x') {
            const response = await fetch(`https://api.delirius.store/download/twitterv2?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            result = data;
        }

        // --- FINAL CHECK ---
        if (result) {
            res.status(200).json(result);
        } else {
            throw new Error("API tidak merespon atau data kosong.");
        }

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ 
            success: false, // Konsisten pake 'success'
            error: 'Server Error', 
            message: error.message 
        });
    }
}
