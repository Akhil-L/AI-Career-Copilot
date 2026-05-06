import { useEffect, useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, MessageSquare, Check, CheckCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function MessagesPage() {
  const { 
    currentUser, 
    conversations, 
    messages, 
    fetchConversations, 
    fetchMessages, 
    sendMessage,
    markMessagesRead
  } = useStore();
  
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Polling conversations
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Polling messages for active conversation
  useEffect(() => {
    if (activeUserId) {
      fetchMessages(activeUserId);
      markMessagesRead(activeUserId);
      const interval = setInterval(() => {
        fetchMessages(activeUserId);
        markMessagesRead(activeUserId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId) return;
    
    setIsSending(true);
    try {
      await sendMessage(activeUserId, newMessage);
      setNewMessage("");
      await fetchMessages(activeUserId);
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  const activeConversation = conversations.find(c => c.userId === activeUserId);
  const filteredConversations = conversations.filter(c => 
    c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] min-h-[600px] flex rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Sidebar */}
      <div className={`w-full md:w-80 flex-col border-r border-slate-200 ${activeUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <MessageSquare className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Message a user after interacting with a task.</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              No results found
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div 
                key={conv.userId}
                onClick={() => setActiveUserId(conv.userId)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${activeUserId === conv.userId ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800">{conv.userName}</span>
                  <span className="text-xs text-slate-400">
                    {conv.lastMessage?.createdAt ? format(new Date(conv.lastMessage.createdAt), 'MMM d') : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 truncate pr-4">
                    {conv.lastMessage?.message || "No messages"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="h-5 w-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-slate-50/30 ${!activeUserId ? 'hidden md:flex' : 'flex'}`}>
        {!activeUserId ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-slate-300" />
            </div>
            <p className="font-medium text-slate-600">Select a conversation</p>
            <p className="text-sm mt-1">Choose a user from the list to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2"
                  onClick={() => setActiveUserId(null)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-bold text-slate-800">{activeConversation?.userName || "Loading..."}</h3>
                  <p className="text-xs text-slate-500 capitalize">{activeConversation?.userRole || "User"}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p className="text-sm">No messages yet. Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === currentUser?.id;
                  const showTimestamp = idx === 0 || 
                    new Date(msg.createdAt).getTime() - new Date(messages[idx-1].createdAt).getTime() > 5 * 60 * 1000;

                  return (
                    <div key={msg.id || msg._id || idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {showTimestamp && (
                        <span className="text-[10px] text-slate-400 font-medium mb-2 mt-2">
                          {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                        </span>
                      )}
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        isMine 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                      {isMine && (
                        <div className="mt-1 flex items-center justify-end pr-1">
                          {msg.read ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Check className="h-3 w-3 text-slate-300" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full pl-4 pr-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                  disabled={isSending}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="absolute right-1 top-1 h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Send className="h-4 w-4 text-white" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}