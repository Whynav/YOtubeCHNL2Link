from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route('/api/extract', methods=['POST'])
def extract_links():
    data = request.json
    channel_url = data.get('url')
    
    if not channel_url:
        return jsonify({'error': 'URL is required'}), 400
        
    ydl_opts = {
        'extract_flat': 'in_playlist',
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': True
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(channel_url, download=False)
            
            if info_dict and 'entries' in info_dict:
                urls = []
                for entry in info_dict['entries']:
                    if entry and entry.get('url'):
                        url = entry.get('url')
                        # Ensure we have full URLs
                        if not url.startswith('http'):
                            url = f"https://www.youtube.com/watch?v={url}"
                        urls.append(url)
                
                if urls:
                    return jsonify({'urls': urls}), 200
                else:
                    return jsonify({'error': 'No videos found. The channel might be empty or the URL format is incorrect.'}), 404
            else:
                return jsonify({'error': 'Could not extract entries. Make sure it is a valid channel or playlist URL.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vercel requires this
if __name__ == '__main__':
    app.run(debug=True, port=8000)
