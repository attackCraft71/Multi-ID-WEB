export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ error: 'URL Missing' });

    let apiUrl = '';
    
    // Header palsu untuk menipu API agar tidak memblokir Vercel
    const fakeHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": "https://google.com"
    };

    switch (type) {
        case 'tiktok':
            apiUrl = `https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`;
            break;
        case 'ig':
            apiUrl = `https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`;
            break;
        case 'fb':
            apiUrl = `https://api.delirius.store/download/facebook?url=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            apiUrl = `https://api.delirius.store/download/twitterv2?url=${encodeURIComponent(url)}`;
            break;
        
        // YOUTUBE: Kita ganti strategi fetch-nya di bawah
        case 'ytmp3':
        case 'ytmp3v2': // Handle variasi nama
            apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(url)}`;
            break;
            
        case 'ytmp4':
        case 'ytmp4v2': 
            apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(url)}`;
            break;
            
        case 'spotify': 
        case 'spotify_v2':
            apiUrl = `https://api.delirius.store/download/spotify?url=${encodeURIComponent(url)}`;
            break;
        case 'apple': 
            apiUrl = `https://api.delirius.store/download/applemusicdl?url=${encodeURIComponent(url)}`;
            break;
        case 'soundcloud':
            apiUrl = `https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(url)}`;
            break;
        default:
            return res.status(400).json({ error: 'Type Unknown' });
    }

    try {
        const response = await fetch(apiUrl, { headers: fakeHeaders });
        
        // Cek jika API error
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
