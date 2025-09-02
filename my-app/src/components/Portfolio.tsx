import React, { useState, useRef, useEffect } from 'react';

import { Copy, Mail, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import './Portfolio.css';

const Portfolio: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);


    const images = [
        '/images/yullin-1.jpg',
        '/images/yullin-2.jpg',
        '/images/yullin-3.jpg',
        '/images/yullin-4.jpg',
        '/images/yullin-5.jpg',
        '/images/yullin-6.jpg'
    ];

    // Auto-advance slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    // Audio time update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText('doliandorian@gmail.com');
            setShowCopyMessage(true);
            setTimeout(() => setShowCopyMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    const openEmail = () => {
        window.location.href = 'mailto:doliandorian@gmail.com';
    };

    return (
        <div className="portfolio">
            <div className="left-section">
                <div className="header">
                    <h1 className="logo">Yullin</h1>
                    <div className="email-section">
                        <span className="email">doliandorian@gmail.com</span>
                        <div className="email-actions">
                            <button onClick={copyEmail} className="email-btn copy-btn" title="Copy email">
                                <Copy size={16} />
                            </button>
                            <button onClick={openEmail} className="email-btn mail-btn" title="Send email">
                                <Mail size={16} />
                            </button>
                        </div>
                        {showCopyMessage && <span className="copy-message">Email copied!</span>}
                    </div>
                </div>

                <div className="about-section">
                    <h2>About</h2>
                    <p>
                        Hi! my name is Yullin, orinially from Seoul, South Korea, I'm a passionate songwriter and performer
                        currently studying at BIMM. my music tends to be a kind of electro-pop with well crafted lyrics
                        With a focus on storytelling.
                    </p>
                </div>

                <div className="social-links">
                    <a href="https://open.spotify.com/artist/1jZid6TJ4dGhJQNwJRZegz?si=L1Zz_tRqSsKR_cq2K0e1PA" target="_blank" rel="noopener noreferrer" className="social-btn spotify">
                        <span>Listen on Spotify</span>
                    </a>
                    <a href="https://youtube.com/@yullinyu?si=jLcnvAVM4tAZYJiA" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
                        <span>Watch on YouTube</span>
                    </a>
                    <a href="https://www.tiktok.com/@yullinseoyeon?_t=ZN-8zOIIMDWN0g&_r=1" target="_blank" rel="noopener noreferrer" className="social-btn tiktok">
                        <span>Follow on TikTok</span>
                    </a>
                </div>
            </div>

            <div className="right-section">
                <div className="slideshow-container">
                    <div className="slideshow">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`slide ${index === currentImageIndex ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${image})` }}
                            />
                        ))}
                    </div>
                    <div className="slideshow-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="audio-player">
                    <div className="audio-info">
                        <h3>Latest Single</h3>
                        <p>"Myself" - Yullin</p>
                    </div>

                    <audio ref={audioRef} src="/audio/latest-single.mp3" />

                    <div className="audio-controls">
                        <button className="control-btn">
                            <SkipBack size={20} />
                        </button>
                        <button className="control-btn play-btn" onClick={togglePlay}>
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button className="control-btn">
                            <SkipForward size={20} />
                        </button>
                    </div>

                    <div className="audio-progress">
                        <span className="time">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                        />
                        <span className="time">{formatTime(duration)}</span>
                    </div>

                    <div className="volume-control">
                        <Volume2 size={16} />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-bar"
                        />
                    </div>
                </div>

                <div className="video-section">
                    <div className="video-container">
                        <iframe
                            src="https://youtu.be/oS2T4GEraSc"
                            title="Yullin - Latest Music Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;