export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, query, url, text, lang, platform } = req.query;

    let apiUrl = '';

    switch (type) {
        case 'gimage':
            apiUrl = `https://api.delirius.store/search/gimage?query=${encodeURIComponent(query)}`;
            break;
        case 'ssweb':
            apiUrl = `https://api.delirius.store/tools/ssweb?url=${encodeURIComponent(url)}`;
            break;
        case 'translate':
            apiUrl = `https://api.delirius.store/tools/translate?text=${encodeURIComponent(text)}&language=${lang}`;
            break;
        case 'ytranscript':
            apiUrl = `https://api.zenzxz.my.id/api/tools/ytranscript?url=${encodeURIComponent(url)}`;
            break;
        case 'ytsummary':
            apiUrl = `https://api.zenzxz.my.id/api/tools/ytsummarizer?url=${encodeURIComponent(url)}&lang=${lang}`;
            break;
        case 'musicsearch':
            // Platform: spotify, applemusic, soundcloud, ytmusic
            // Mapping nama platform untuk API Delirius
            let endpoint = platform; 
            if(platform === 'ytmusic') endpoint = 'searchtrack'; // YT Music beda endpoint
            apiUrl = `https://api.delirius.store/search/${endpoint}?q=${encodeURIComponent(query)}&text=${encodeURIComponent(query)}`;
            break;
        default:
            return res.status(400).json({ error: 'Invalid Tool Type' });
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'API Error' });
    }
}
