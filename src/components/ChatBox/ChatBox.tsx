import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Robot } from 'tabler-icons-react';

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

const ChatBox = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            // Đợi một chút để UI render xong rồi mới scroll
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [isOpen, messages, isLoading]);

    // Khởi tạo và load từ localStorage
    useEffect(() => {
        const savedChat = localStorage.getItem('ai_chat_history');
        if (savedChat) {
            const { messages: savedMessages, timestamp } = JSON.parse(savedChat);
            const now = new Date().getTime();
            const oneHour = 60 * 60 * 1000;

            // Nếu chưa quá 1 tiếng thì mới khôi phục
            if (now - timestamp < oneHour) {
                setMessages(savedMessages);
            } else {
                localStorage.removeItem('ai_chat_history');
                setMessages([{ sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI. Bạn muốn tìm sách gì?' }]);
            }
        } else {
            setMessages([{ sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI. Bạn muốn tìm sách gì?' }]);
        }
    }, []);

    // Lưu vào localStorage mỗi khi tin nhắn thay đổi
    useEffect(() => {
        if (messages.length > 0) {
            const chatData = {
                messages,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('ai_chat_history', JSON.stringify(chatData));
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8085/api/chat/book-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, đã xảy ra lỗi khi kết nối với máy chủ.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Không thể kết nối đến máy chủ.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href && (href.startsWith('http://localhost:3000') || href.startsWith('/'))) {
                e.preventDefault();
                const path = href.replace('http://localhost:3000', '');
                navigate(path);
                setIsOpen(false);
            }
        }
    };

    const renderMessage = (text: string) => {
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        const boldRegex = /\*\*(.*?)\*\*/g;

        const lines = text.split('\n').map((line, i) => {
            const images: JSX.Element[] = [];
            const lineWithoutImages = line.replace(imageRegex, (match, alt, url) => {
                images.push(
                    <div key={url} className="my-3 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer group" 
                         onClick={() => {
                             const slugMatch = url.match(/\/product\/(.*)/);
                             if (slugMatch) {
                                 navigate('/product/' + slugMatch[1]);
                                 setIsOpen(false);
                             }
                         }}>
                        <img src={url} alt={alt} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                );
                return '';
            });

            let currentText = lineWithoutImages;
            // Xóa icon, giữ lại format text sạch sẽ
            currentText = currentText.replace(/^- Giá: (.*)/g, '<div class="mt-1 text-sm"><span class="font-medium">Giá:</span> <span class="font-bold text-green-600 dark:text-green-400">$1</span></div>');
            currentText = currentText.replace(/^- Tác giả: (.*)/g, '<div class="text-[12.5px] text-gray-500 dark:text-gray-400">Tác giả: $1</div>');
            currentText = currentText.replace(/^- Thể loại: (.*)/g, '<div class="text-[12.5px] text-gray-500 dark:text-gray-400">Thể loại: $1</div>');
            
            currentText = currentText.replace(boldRegex, '<strong class="font-bold text-black dark:text-white">$1</strong>');
            currentText = currentText.replace(linkRegex, '<div class="mt-2 mb-1"><a href="$2" class="text-[15px] text-blue-600 dark:text-blue-400 font-bold hover:underline">$1</a></div>');

            if (!currentText.trim() && images.length === 0) return null;

            return (
                <div key={i} onClick={handleLinkClick} className="message-line">
                    <div dangerouslySetInnerHTML={{ __html: currentText }} />
                    {images}
                </div>
            );
        });

        return lines;
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white dark:border-gray-800"
                >
                    <Robot size={28} />
                </button>
            )}

            {isOpen && (
                <div className="flex flex-col w-80 sm:w-96 h-[550px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between px-4 py-4 bg-black dark:bg-gray-800 text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                                <Robot size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Trợ lý sách AI</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-gray-400 font-medium">Đang trực tuyến</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-black text-white rounded-br-sm'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-600'
                                        }`}>
                                        {renderMessage(msg.text)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-600 text-[13px] text-gray-500 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                        Đang tìm sách...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Hỏi AI về sách..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-sm rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
