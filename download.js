export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ error: 'URL Missing' });

    let apiUrl = '';
    // Logika Pemilihan API
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
        case 'ytmp3':
            apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(url)}`;
            break;
        case 'ytmp4':
            // Resolusi default auto, bisa dikembangkan nanti
            apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(url)}`;
            break;
        case 'spotify': // V1
            apiUrl = `https://api.delirius.store/download/spotify?url=${encodeURIComponent(url)}`;
            break;
            
        case 'spotify_v2': // V2 (Tambahkan ini agar logika V2 di HTML jalan)
            apiUrl = `https://api.vreden.my.id/api/v1/music/spotify?url=${encodeURIComponent(url)}`;
            break;
            
        case 'apple': // Sesuaikan nama type dengan HTML
            apiUrl = `https://api.delirius.store/download/applemusicdl?url=${encodeURIComponent(url)}`;
            break;
            
        case 'soundcloud':
            apiUrl = `https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(url)}`;
            break;
        default:
            return res.status(400).json({ error: 'Type Unknown' });
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
}