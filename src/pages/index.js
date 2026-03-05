import { useState } from 'react';
import Head from 'next/head';
import { Youtube, Search, Loader2, Copy, CheckCircle2, Download } from 'lucide-react';

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const extractLinks = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setLinks([]);
        setCopied(false);

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to extract links');
            }

            setLinks(data.urls);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const text = links.join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadLinks = () => {
        const text = links.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-links.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30">
            <Head>
                <title>YT Links Extractor</title>
                <meta name="description" content="Extract YouTube channel video links for free" />
            </Head>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <Youtube className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                        Channel Extractor
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        Extract all video links from any YouTube channel or playlist instantly. Free and unlimited.
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={extractLinks} className="relative">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube channel or playlist URL..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !url}
                                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-medium px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Extracting...
                                    </>
                                ) : (
                                    'Extract Links'
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {links.length > 0 && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-medium text-white/90">
                                    Found <span className="text-red-400 font-bold">{links.length}</span> videos
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={downloadLinks}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-white/10 rounded-xl p-4 h-[400px] overflow-y-auto font-mono text-sm text-white/70 overflow-x-hidden break-all custom-scrollbar">
                                {links.map((link, i) => (
                                    <div key={i} className="py-2 border-b border-white/5 last:border-0 hover:text-white transition-colors">
                                        {link}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
