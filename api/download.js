export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ error: 'URL Missing' });

    try {
        let result = null;

        // --- KHUSUS YOUTUBE (Gunakan Cobalt API - Lebih Stabil) ---
        if (type.startsWith('yt')) {
            const isAudio = type.includes('mp3');
            
            // Request ke Cobalt (POST Method)
            const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                body: JSON.stringify({
                    url: url,
                    vCodec: "h264",
                    vQuality: "720",
                    aFormat: "mp3",
                    isAudioOnly: isAudio
                })
            });

            const cobaltJson = await cobaltResponse.json();
            
            // Format ulang agar sesuai dengan HTML kita
            if (cobaltJson.url) {
                result = {
                    status: true,
                    data: {
                        title: "YouTube Video (Cobalt)", // Cobalt kadang tidak kasih judul
                        download_url: cobaltJson.url,
                        thumbnail: "https://i.imgur.com/6jX6z5D.png" // Placeholder aman
                    }
                };
            } else {
                throw new Error("Cobalt Gagal");
            }
        } 
        
        // --- LAINNYA (Tiktok, IG, FB, dll) ---
        else {
            let apiUrl = '';
            switch (type) {
                case 'tiktok': apiUrl = `https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`; break;
                case 'ig': apiUrl = `https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`; break;
                case 'fb': apiUrl = `https://api.delirius.store/download/facebook?url=${encodeURIComponent(url)}`; break;
                case 'twitter': apiUrl = `https://api.delirius.store/download/twitterv2?url=${encodeURIComponent(url)}`; break;
                case 'spotify': apiUrl = `https://api.delirius.store/download/spotify?url=${encodeURIComponent(url)}`; break;
                case 'soundcloud': apiUrl = `https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(url)}`; break;
                case 'apple': apiUrl = `https://api.delirius.store/download/applemusicdl?url=${encodeURIComponent(url)}`; break;
            }

            const response = await fetch(apiUrl);
            result = await response.json();
        }

        res.status(200).json(result);

    } catch (error) {
        // Fallback terakhir jika semua gagal
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
}
