import { useState, useEffect } from "react";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";

export default function Forums() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!newPostTitle || !newPostContent) return;
    if (!user) return alert("Please login to post!");

    const postData = {
      author: user.name,
      authorId: user._id,
      title: newPostTitle,
      content: newPostContent,
    };

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const savedPost = await res.json();
        setPosts([savedPost, ...posts]);
        setNewPostTitle("");
        setNewPostContent("");
      }
    } catch (err) {
      alert("Failed to save post to database.");
    }
  };

  const addComment = async (postId, text) => {
    if (!text || !user) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: user.name,
          text: text,
        }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
      }
    } catch (err) {
      alert("Failed to save comment.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Dynamic Red Header */}
      <div className="bg-red-600 pt-16 pb-24 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mt-20 blur-3xl"></div>
        <div className="max-w-4xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Community Forum</h1>
            <p className="text-red-100 font-bold opacity-80 uppercase tracking-widest text-xs mt-1">TP Student Discussions</p>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="bg-white text-red-600 px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg active:scale-95 text-sm"
          >
            BACK TO LIBRARY
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-20">
        {/* Create Post Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 mb-12 border border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-black text-red-600">
                {user?.name?.charAt(0) || "G"}
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Posting as <span className="text-red-600">{user?.name || "Guest"}</span>
            </p>
          </div>
          
          <input
            type="text"
            placeholder="What's the topic?"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl mb-4 focus:ring-4 focus:ring-red-100 outline-none font-bold text-gray-800 placeholder:text-gray-400 transition-all"
          />
          <textarea
            placeholder="Share your thoughts, reviews, or questions..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl mb-6 focus:ring-4 focus:ring-red-100 outline-none h-32 resize-none font-medium text-gray-700 transition-all"
          />
          <button 
            onClick={addPost} 
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95 uppercase tracking-tight"
          >
            Post to Forum
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold italic">The forum is quiet... start a discussion!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-[3rem] shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="font-black text-2xl text-gray-900 tracking-tight leading-tight uppercase">{post.title}</h2>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Discussion</span>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed font-medium text-lg">{post.content}</p>
                
                <div className="flex items-center gap-3 pb-8 border-b border-gray-50">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-black text-white uppercase shadow-md">
                    {post.author.charAt(0)}
                  </div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Published By <span className="text-gray-900">{post.author}</span></p>
                </div>
                
                {/* Comments Section */}
                <div className="mt-8 space-y-4">
                  {post.comments?.map((c, index) => (
                    <div key={index} className="flex gap-4 items-start bg-gray-50 p-5 rounded-3xl">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-red-600 border border-gray-100">
                        {c.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{c.author}</p>
                        <p className="text-sm text-gray-700 font-bold leading-snug">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <AddComment postId={post._id} addComment={addComment} user={user} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AddComment({ postId, addComment, user }) {
  const [text, setText] = useState("");
  
  const handleSubmit = () => {
    if(!text.trim()) return;
    addComment(postId, text);
    setText("");
  };

  return (
    <div className="flex gap-4 mt-6 items-center">
      <input
        type="text"
        placeholder={user ? "Write a reply..." : "Sign in to join the conversation"}
        disabled={!user}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="flex-1 bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-100 transition-all border-none"
      />
      <button 
        onClick={handleSubmit} 
        disabled={!text.trim()}
        className="bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-red-700 disabled:bg-gray-200 transition-all active:scale-90 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  );
}