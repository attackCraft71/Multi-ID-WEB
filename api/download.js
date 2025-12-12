// api/download.js
// RECODE BY: V-tihX
// FIX: Back to Zenzxz API for YouTube (More Stable on Vercel)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');

    const { type, url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL Missing' });
    }

    try {
        let result = null;

        // ==========================================
        // 🟥 SEKTOR YOUTUBE (ZENZXZ API - THE LEGEND)
        // ==========================================
        if (['ytmp3', 'ytmp4', 'ytmp3v2', 'youtube'].includes(type)) {
            
            // Logic: Cek mau MP3 atau MP4
            // Default pake ytmp3 karena biasanya endpoint ini kasih metadata lengkap (judul, thumb)
            let endpoint = 'ytmp3'; 
            if (type.includes('mp4')) endpoint = 'ytmp4';

            const apiUrl = `https://api.zenzxz.my.id/api/downloader/${endpoint}?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Cek Response dari Zenzxz
            if (data.status === 200 && data.result) {
                result = {
                    success: true, // PENTING: Label ini biar HTML lo ngebaca 'Sukses'
                    data: {
                        title: data.result.title || "YouTube Video",
                        thumbnail: data.result.thumb || "https://i.imgur.com/6jX6z5D.png",
                        duration: 0, // Zenz kadang gak kirim durasi, set 0 biar aman
                        download_url: data.result.download_url || data.result.url
                    }
                };
            } else {
                throw new Error("Zenzxz Gagal / Limit Habis. Coba beberapa saat lagi.");
            }
        } 

        // ==========================================
        // 🎵 SEKTOR YOUTUBE MUSIC (ZENZXZ)
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
                        title: data.result.title || "YouTube Music",
                        artist: data.result.channel || "Unknown",
                        image: data.result.thumb,
                        download_url: data.result.download_url || data.result.best_quality_url
                    }
                };
            }
        }

        // ==========================================
        // 🟢 SEKTOR SPOTIFY (Vreden)
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
                        download_url: data.result.music_url
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
        // ⬛ SEKTOR TIKTOK
        // ==========================================
        else if (type === 'tiktok') {
            const response = await fetch(`https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if(data.status) result = data;
        }

        // ==========================================
        // 🟪 SEKTOR SOSMED LAIN (IG, FB, TWITTER)
        // ==========================================
        else if (['ig', 'instagram', 'fb', 'facebook', 'twitter', 'x'].includes(type)) {
            let endpoint = '';
            if (type.includes('ig') || type.includes('insta')) endpoint = 'instagram';
            else if (type.includes('fb') || type.includes('face')) endpoint = 'facebook';
            else endpoint = 'twitterv2';

            const response = await fetch(`https://api.delirius.store/download/${endpoint}?url=${encodeURIComponent(url)}`);
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
            success: false, 
            error: 'Server Error', 
            message: error.message 
        });
    }
}
