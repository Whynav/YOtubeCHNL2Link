import streamlit as st
import yt_dlp

st.set_page_config(page_title="YT Links Extractor", page_icon="🎥")

st.title("🎥 YouTube Channel Links Extractor")
st.markdown("Extract all video links from a YouTube channel or playlist for free.")

channel_url = st.text_input("Enter YouTube Channel or Playlist URL:", placeholder="https://www.youtube.com/@ChannelName")

if st.button("Extract Video Links", type="primary"):
    if channel_url:
        with st.spinner("Extracting links... This may take a moment depending on the number of videos."):
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
                                # Sometimes yt-dlp returns relative paths or just IDs, ensure we have full URLs
                                if not url.startswith('http'):
                                    url = f"https://www.youtube.com/watch?v={url}"
                                urls.append(url)
                        
                        if urls:
                            st.success(f"✅ Successfully found {len(urls)} video links!")
                            
                            # Display as text area for easy copying
                            links_text = "\n".join(urls)
                            st.text_area("Copy your links below:", value=links_text, height=300)
                            
                            # Provide download button
                            st.download_button(
                                label="Download as .txt",
                                data=links_text,
                                file_name="youtube_links.txt",
                                mime="text/plain"
                            )
                        else:
                            st.warning("No videos found. The channel might be empty or the URL format is incorrect.")
                    else:
                        st.error("Could not extract entries. Make sure it's a valid channel or playlist URL.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")
    else:
        st.warning("Please enter a valid URL first.")
