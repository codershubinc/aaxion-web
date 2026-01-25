"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
    Home, 
    Menu, 
    Check, 
    Copy, 
    Terminal, 
    Server, 
    Smartphone, 
    Shield, 
    Zap, 
    Cpu,
    ChevronRight,
    Github,
    Book,
    Code2,
    UploadCloud,
    ExternalLink,
    Star
} from 'lucide-react';

// --- Code Block Component ---
const CodeBlock = ({ language, code }: { language: string, code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-gray-800 bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 md:bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 md:bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 md:bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono ml-2">{language}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                    title="Copy code"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                    showLineNumbers={true} 
                    lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#555', textAlign: 'right' }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

// --- Section Heading Component ---
const SectionHeading = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <div className="flex items-center space-x-3 mb-6 mt-12 border-b border-gray-800 pb-4" id={id}>
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Icon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
    </div>
);

export default function Docs() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const res = await fetch('https://api.github.com/repos/codershubinc/aaxion');
                const data = await res.json();
                setStars(data.stargazers_count);
            } catch (e) {
                console.error('Failed to fetch stars', e);
            }
        };
        fetchStars();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id], div[id^="api-"]');
            let current = '';
            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id') || '';
                }
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
            if(window.innerWidth < 1024) setIsSidebarOpen(false);
        }
    };

    const navItems = [
        { id: 'introduction', label: 'Introduction', icon: Book },
        { id: 'installation', label: 'Installation', icon: Terminal },
        { id: 'usage', label: 'Usage Guide', icon: Smartphone },
        { id: 'how-it-works', label: 'How It Works', icon: Zap },
        { 
            id: 'api-reference', 
            label: 'API Reference', 
            icon: Code2,
            children: [
                { id: 'api-auth', label: 'Authentication & Setup' },
                { id: 'api-user', label: 'User Management' },
                { id: 'api-view', label: 'Files & Folders' },
                { id: 'api-upload', label: 'Upload System' },
                { id: 'api-share', label: 'File Sharing' },
                { id: 'api-images', label: 'Images & Thumbnails' },
                { id: 'api-system', label: 'System Info' },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
            
            {/* Top Navigation */}
            <header className="fixed top-0 w-full h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800 z-50">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600/20 p-1.5 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                                <Zap className="text-blue-500 w-5 h-5" fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Aaxion Docs
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://github.com/codershubinc/aaxion" 
                            target="_blank" 
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-sm font-medium"
                        >
                            <Github size={16} />
                            <span>GitHub</span>
                            {stars !== null && (
                                <span className="flex items-center gap-1 ml-1 text-gray-400 border-l border-gray-700 pl-2">
                                     <span className="text-xs">{stars}</span>
                                     <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                </span>
                            )}
                        </a>
                        <Link 
                            href="/" 
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                            title="Back to Home"
                        >
                            <Home size={20} />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="pt-16 flex max-w-8xl mx-auto">
                
                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-[#0a0a0a] border-r border-gray-800 overflow-y-auto transform transition-transform duration-300 z-40
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <nav className="p-6 space-y-1">
                        <div className="mb-6 px-3">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Documentation</h5>
                        </div>
                        {navItems.map((item) => (
                            <div key={item.id} className="space-y-1">
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                        activeSection === item.id || (item.children && item.children.some(child => activeSection === child.id))
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                                    }`}
                                >
                                    <item.icon size={16} className={activeSection === item.id || (item.children && item.children.some(child => activeSection === child.id)) ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'} />
                                    {item.label}
                                    {activeSection === item.id && (
                                        <ChevronRight size={14} className="ml-auto opacity-50" />
                                    )}
                                </button>
                                {item.children && (activeSection === item.id || item.children.some(child => activeSection === child.id)) && (
                                    <div className="ml-4 pl-4 border-l border-gray-800 space-y-1 mt-1">
                                        {item.children.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => scrollToSection(child.id)}
                                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                    activeSection === child.id
                                                    ? 'text-blue-400 font-medium'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <div className="mt-8 mb-4 px-3">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resources</h5>
                        </div>
                        <a href="https://github.com/codershubinc/aaxion/releases" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
                            <UploadCloud size={16} />
                            Releases
                        </a>
                    </nav>
                </aside>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-12">
                        
                        {/* Hero */}
                        <div className="mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    v1.0.0 Stable
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                                    Aaxion Documentation
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                                    Turn your legacy hardware into a high-performance, secure file cloud. Stream files efficiently with zero-buffer technology.
                                </p>
                            </motion.div>
                        </div>

                        {/* Introduction */}
                        <section id="introduction">
                            <SectionHeading id="introduction" icon={Book} title="Introduction" />
                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p className="mb-6">
                                    Aaxion is engineered to breathe new life into old hardware. By running a highly optimized Go server, you can transform an old laptop or desktop with spare storage into a dedicated cloud node for your main devices.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 my-8">
                                    {[
                                        { title: 'Zero-Buffer Streaming', icon: Zap, desc: 'Streams data directly to disk. 10GB transfers use only ~32KB RAM.' },
                                        { title: 'Resumable Uploads', icon: Server, desc: 'Chunked upload support handles unstable networks seamlessly.' },
                                        { title: 'Secure Sharing', icon: Shield, desc: 'Generate one-time, time-limited secure links for external sharing.' },
                                        { title: 'Efficient', icon: Cpu, desc: 'Minimal footprint. Runs on Linux (systemd) and Windows.' },
                                    ].map((feat, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all">
                                            <feat.icon className="w-6 h-6 text-blue-500 mb-3" />
                                            <h3 className="text-white font-semibold mb-1">{feat.title}</h3>
                                            <p className="text-sm text-gray-400">{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Installation */}
                        <section id="installation">
                            <SectionHeading id="installation" icon={Terminal} title="Installation" />
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">1. Download Binary</h3>
                                    <p className="text-gray-400 mb-2">Get the latest release for your operating system.</p>
                                    <a href="https://github.com/codershubinc/aaxion/releases" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium">
                                        Visit Releases Page <ExternalLink size={14} />
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">2. Setup & Run</h3>
                                    <div className="bg-gray-900/50 rounded-lg p-1 border border-gray-800">
                                        <div className="flex gap-2 p-2 border-b border-gray-800 mb-2">
                                            <span className="text-xs font-mono text-gray-500">TERMINAL</span>
                                        </div>
                                        <div className="px-2">
                                            <p className="text-sm text-gray-400 mb-2">For Linux/macOS:</p>
                                            <CodeBlock language="bash" code={`# Make executable
chmod +x aaxion-linux-amd64

# Run server
./aaxion-linux-amd64`} />
                                            
                                            <p className="text-sm text-gray-400 mt-4 mb-2">For Windows:</p>
                                            <CodeBlock language="powershell" code={`# Just run the executable
.\\aaxion-windows-amd64.exe`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Usage */}
                        <section id="usage">
                            <SectionHeading id="usage" icon={Smartphone} title="Usage Guide" />
                            <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
                                <h3 className="text-lg font-semibold text-white mb-4">Connect via Mobile App</h3>
                                <ol className="space-y-4">
                                    {[
                                        "Download the Aaxion Mobile App from the release page.",
                                        "Launch the app and go to Settings tab.",
                                        "Enter your server IP (e.g., 192.168.1.x) and Port (8080).",
                                        "Save configuration and start browsing your files."
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-4">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                                            <span className="text-gray-300">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {/* How It Works */}
                        <section id="how-it-works">
                            <SectionHeading id="how-it-works" icon={Zap} title="How It Works" />
                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p>
                                    Aaxion operates by serving a file system tree over a RESTful JSON API. Security is handled via path sanitization to prevent directory traversal. The server automatically filters out hidden files (dotfiles) to keep the view clean.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span><strong>Systemd Integration:</strong> Designed to run as a background service on Linux.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span><strong>Low Resource Mode:</strong> Idle memory usage is ~10MB.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* API Reference */}
                        <section id="api-reference">
                            <SectionHeading id="api-reference" icon={Code2} title="API Reference" />
                            <div className="prose prose-invert max-w-none text-gray-400 mb-10">
                                <p>A concise, developer-friendly reference for the aaxion file-service API. Use the examples below to interact with a local server.</p>
                                <p className="mt-4">
                                    Base URL (local): <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-400">http://localhost:8080/</code>
                                </p>
                            </div>

                            <div className="space-y-16">
                                
                                {/* Authentication */}
                                <div id="api-auth" className="scroll-mt-24">
                                    <h3 className="text-xl font-bold text-white mb-4">🔐 Authentication</h3>
                                    <p className="text-gray-400 mb-6">
                                        Most endpoints require authentication. You must obtain a token and include it in the `Authorization` header.
                                        <br /><br />
                                        Header format: <code className="text-blue-400">Authorization: Bearer {'<your_token>'}</code>
                                    </p>
                                    
                                    <h4 className="text-lg text-white font-semibold mt-6 mb-3">Quick examples</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Login:</p>
                                            <CodeBlock language="bash" code={`curl -X POST -d '{"username":"your_user","password":"your_pass"}' "http://localhost:8080/auth/login"`} />
                                        </div>
                                    </div>
                                </div>

                                {/* User Management */}
                                <div id="api-user" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-6">👤 User Management</h3>
                                    
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                                                <code className="text-base text-gray-200">/auth/register</code>
                                            </div>
                                            <p className="text-gray-400">Register the first user. Fails if a user already exists.</p>
                                            <p className="text-gray-500 text-sm mt-1">Body: <code className="text-gray-400">{`{"username": "...", "password": "..."}`}</code></p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                                                <code className="text-base text-gray-200">/auth/login</code>
                                            </div>
                                            <p className="text-gray-400">Authenticate and receive a session token.</p>
                                            <p className="text-gray-500 text-sm mt-1">Response: <code className="text-gray-400">{`{"token": "..."}`}</code></p>
                                        </div>
                                    </div>
                                </div>

                                {/* View Files */}
                                <div id="api-view" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-6">📁 View Files and Folders</h3>
                                    <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800/60">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                            <code className="text-lg text-gray-200">/files/view?dir={'{directory_path}'}</code>
                                        </div>
                                        <p className="text-gray-400 mb-4">Return the contents of a directory. <span className="text-yellow-500/80 text-sm ml-2">⚠️ dir must be within monitored root</span></p>
                                        
                                        <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" "http://localhost:8080/files/view?dir=/home/swap/documents"`} />
                                        
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Example Response</p>
                                            <CodeBlock language="json" code={`[
  {
    "name": "Quazaar",
    "is_dir": true,
    "size": 4096,
    "path": "/home/swap/Github",
    "raw_path": "/home/swap/Github/Quazaar"
  }
]`} />
                                        </div>
                                    </div>

                                    <div className="mt-8" id="api-create-dir">
                                        <h4 className="text-lg font-bold text-white mb-4">Create Directory</h4>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                                            <code className="text-gray-200">/files/create-directory?path={'{directory_path}'}</code>
                                        </div>
                                        <p className="text-gray-400 mb-2">Create a new directory at the specified path.</p>
                                        <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" -X POST "http://localhost:8080/files/create-directory?path=/home/swap/new_folder"`} />
                                    </div>
                                </div>

                                {/* Upload */}
                                <div id="api-upload" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-2">📤 Upload System</h3>
                                    <p className="text-gray-400 mb-8">Support for both single requests and chunked uploads for large files.</p>

                                    <div className="space-y-10">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-200 mb-4">Single File Upload</h4>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                                                <code className="text-gray-200">/files/upload?dir={'{directory_path}'}</code>
                                            </div>
                                            <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" -F "file=@/tmp/example.txt" "http://localhost:8080/files/upload?dir=/home/swap/documents"`} />
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-200 mb-4">Chunked Upload (Large Files)</h4>
                                            <div className="space-y-6 pl-4 border-l-2 border-gray-800">
                                                <div>
                                                    <p className="text-sm font-bold text-blue-400 mb-1">1. Start Session</p>
                                                    <code className="block bg-gray-900 px-2 py-1 rounded text-gray-300 text-sm mb-2">POST /files/upload/chunk/start?filename=...</code>
                                                    <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" -X POST "http://localhost:8080/files/upload/chunk/start?filename=large.zip"`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-blue-400 mb-1">2. Upload Chunk (Binary Body)</p>
                                                    <code className="block bg-gray-900 px-2 py-1 rounded text-gray-300 text-sm mb-2">POST /files/upload/chunk?filename=...&chunk_index=0</code>
                                                    <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" --data-binary @chunk0.bin "http://localhost:8080/files/upload/chunk?filename=large.zip&chunk_index=0"`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-blue-400 mb-1">3. Complete & Merge</p>
                                                    <code className="block bg-gray-900 px-2 py-1 rounded text-gray-300 text-sm mb-2">POST /files/upload/chunk/complete?filename=...&dir=...</code>
                                                    <CodeBlock language="bash" code={`curl -H "Authorization: Bearer $TOKEN" -X POST "http://localhost:8080/files/upload/chunk/complete?filename=large.zip&dir=/home/swap/documents"`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sharing */}
                                <div id="api-share" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-6">🔗 Temporary File Sharing</h3>
                                    
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-3">1. Generate Link</h4>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                                <code className="text-sm text-gray-200">/files/d/r?file_path=...</code>
                                            </div>
                                            <CodeBlock language="bash" code={`curl "http://localhost:8080/files/d/r?file_path=/home/user/file.txt"`} />
                                            <div className="mt-2 bg-gray-900 p-3 rounded border border-gray-800 text-xs text-gray-400 font-mono">
                                                {`{ "share_link": "/files/d/t/abc...", "token": "abc..." }`}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-3">2. Download via Token</h4>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                                <code className="text-sm text-gray-200">/files/d/t/{'{token}'}</code>
                                            </div>
                                            <p className="text-xs text-green-400 mb-2">No Auth Required (Public)</p>
                                            <CodeBlock language="bash" code={`curl -O "http://localhost:8080/files/d/t/abcdef..."`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Images */}
                                <div id="api-images" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-6">🖼️ Images & Thumbnails</h3>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                                <code className="text-gray-200">/files/view-image?path=...</code>
                                            </div>
                                            <p className="text-gray-400 mb-2">Serve raw image file (supports caching).</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                                <code className="text-gray-200">/files/thumbnail?path=...</code>
                                            </div>
                                            <p className="text-gray-400 mb-3">Get resized JPEG thumbnail (max 200px).</p>
                                            <p className="text-sm text-gray-500">Supports <code className="text-gray-400">?tkn=</code> param for &lt;img&gt; tags.</p>
                                            <CodeBlock language="bash" code={`curl "http://localhost:8080/files/thumbnail?path=...&tkn=$TOKEN"`} />
                                        </div>
                                    </div>
                                </div>

                                {/* System */}
                                <div id="api-system" className="scroll-mt-24 border-t border-gray-800 pt-12">
                                    <h3 className="text-xl font-bold text-white mb-4">System Info</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                                        <code className="text-gray-200">/api/system/get-root-path</code>
                                    </div>
                                    <CodeBlock language="json" code={`{ "root_path": "/home/swap" }`} />
                                </div>

                            </div>
                        </section>

                    </div>

                    {/* Footer */}
                    <footer className="border-t border-gray-800 bg-[#0a0a0a] mt-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Zap className="text-blue-500 w-6 h-6" />
                                    <span className="text-xl font-bold text-gray-200">Aaxion</span>
                                </div>
                                <div className="flex gap-8 text-sm text-gray-400">
                                    <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                                    <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
                                    <a href="https://github.com/codershubinc/aaxion" className="hover:text-blue-400 transition-colors">GitHub</a>
                                    <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                                </div>
                            </div>
                            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                                <p>&copy; {new Date().getFullYear()} CodersHub Inc. All rights reserved.</p>
                                <p className="mt-2">Aaxion is a trademark of CodersHub Inc.</p>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
