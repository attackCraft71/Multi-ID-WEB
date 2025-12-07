export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, query, model, url, scale } = req.query;

    try {
        let apiUrl = '';
        if (type === 'chat') {
            if (model === 'deepseek') apiUrl = `https://api.zenzxz.my.id/api/ai/chatai?query=${encodeURIComponent(query)}&model=deepseek-v3`;
            else if (model === 'llama') apiUrl = `https://api.zenzxz.my.id/api/ai/chatai?query=${encodeURIComponent(query)}&model=llama-v3p1-405b-instruct`;
            else if (model === 'gpt5') apiUrl = `https://api.zenzxz.my.id/api/ai/copilotai?message=${encodeURIComponent(query)}&model=gpt-5`;
            else if (model === 'openai') apiUrl = `https://api.delirius.store/ia/chatgpt?q=${encodeURIComponent(query)}`;
        } 
        else if (type === 'remini') {
            apiUrl = `https://api.zenzxz.my.id/api/tools/upscalev2?url=${encodeURIComponent(url)}&scale=${scale || 2}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'AI Error' });
    }
}
