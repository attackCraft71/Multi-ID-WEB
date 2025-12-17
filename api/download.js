
export default async function handler(req, res) {
    // Header untuk mengizinkan akses dari domain mana saja (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ success: false, error: 'URL Missing' });

    try {
        let result = null;

        // ==========================================
        // 🟥 SEKTOR YOUTUBE (Ganti ke ZENZXZ API)
        // ==========================================
        if (type === 'ytmp3' || type === 'ytmp4' || type === 'ytmp3v2' || type === 'youtube') {
            
            // Tentukan endpoint berdasarkan tipe permintaan
            // Jika request MP3, pakai ytmp3v2. Jika MP4, pakai ytmp4v2
            let endpoint = 'ytmp3'; 
            if (type.includes('mp4')) endpoint = 'ytmp4';

            // Kita gunakan API Zenzxz karena terbukti works di file HTML kamu
            const apiUrl = `https://api.zenzxz.my.id/api/downloader/${endpoint}?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Cek apakah API Zenzxz memberikan respon sukses
            if (data.status === 200 && data.result) {
                result = {
                    success: true, // Sesuaikan dengan yang diminta yt.html (json.success)
                    data: {
                        title: data.result.title || "YouTube Video",
                        thumbnail: data.result.thumb || "https://i.imgur.com/6jX6z5D.png",
                        duration: 0, // Zenzxz kadang tidak kirim durasi, set 0 biar aman
                        download_url: data.result.download_url || data.result.url
                    }
                };
            } else {
                throw new Error("Zenzxz Gagal mengambil data.");
            }
        } 

        // ==========================================
        // ⬛ SEKTOR LAINNYA (Tiktok, IG, FB, dll)
        // ==========================================
        else {
            let apiUrl = '';
            // Mapping endpoint Delirius
            if (type === 'tiktok') apiUrl = `https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`;
            else if (type === 'ig') apiUrl = `https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`;
            else if (type === 'fb') apiUrl = `https://api.delirius.store/download/facebook?url=${encodeURIComponent(url)}`;
            else if (type === 'twitter') apiUrl = `https://api.delirius.store/download/twitterv2?url=${encodeURIComponent(url)}`;
            else if (type === 'spotify') apiUrl = `https://api.delirius.store/download/spotify?url=${encodeURIComponent(url)}`;
            else if (type === 'soundcloud') apiUrl = `https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(url)}`;
            else if (type === 'apple') apiUrl = `https://api.delirius.store/download/applemusicdl?url=${encodeURIComponent(url)}`;

            if(apiUrl) {
                const response = await fetch(apiUrl);
                const data = await response.json();
                // Delirius biasanya return structure { status: true, data: ... }
                // Kita pass langsung aja, atau bungkus ulang kalau perlu
                result = data;
            }
        }

        // Kirim respon balik ke Frontend
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ success: false, error: 'Data kosong' });
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
