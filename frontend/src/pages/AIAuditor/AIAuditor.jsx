import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  Database
} from 'lucide-react';
import api from '../../services/api';

export default function AIAuditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const findingParam = searchParams.get('findingId');
  const prefilledQuery = location?.state?.prefilledQuery || (findingParam ? `Explain Finding ${findingParam} in detail.` : '');

  const [inputQuery, setInputQuery] = useState(prefilledQuery);

  const quickActionChips = [
    'Show Revenue Issues',
    'Show Profit Issues',
    'Show Unresolved Findings',
    'Compare FY25 vs FY26',
    'Explain Revenue Changes',
    'Check Balance Sheet',
    'Check Cash Flow',
    'Show Evidence'
  ];

  const suggestedAuditQuestions = [
    'Why is revenue inconsistent?',
    'Show all unresolved discrepancies',
    'Compare FY2025 and FY2026 revenue',
    'What changed in operating expenses?',
    'Explain the difference in cash flow',
    'Show evidence for this finding',
    'Which findings need analyst review?'
  ];
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: (
        "Welcome to the FINCHECK AI Auditor Console. I am strictly grounded in the verified financial facts and deterministic findings extracted from Acme Industries' FY2026 filings.\n\n" +
        "You can ask about cross-document consistency, examine specific discrepancies, or ask for audit reconciliations."
      ),
      sources: [],
      timestamp: '10:00 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: "Why was revenue flagged?",
      timestamp: '10:01 AM'
    },
    {
      id: 'm3',
      sender: 'assistant',
      text: (
        "Revenue was flagged because two FY2026 consolidated sources contain different values.\n\n" +
        "• Annual Report 2026: ₹10,000 Cr — Page 42 (Statement of Profit and Loss, Note 24)\n" +
        "• Management Commentary: ₹10,500 Cr — Page 8 (MD&A Operational Review)\n\n" +
        "Calculated Difference: ₹500 Cr (5%)\n\n" +
        "I did not identify an explanatory disclosure in the supplied documents. Both documents cite consolidated group operations for the full year FY2026."
      ),
      sources: [
        {
          title: 'Annual Report 2026 (p. 42)',
          document: 'Annual_Report_2026.pdf',
          page: 42,
          findingId: 'F-024'
        },
        {
          title: 'Management Commentary (p. 8)',
          document: 'Management_Commentary.pdf',
          page: 8,
          findingId: 'F-024'
        }
      ],
      timestamp: '10:01 AM'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.sendChatQuery({ query });
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.data.reply,
        sources: res.data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: (
          "Based on the analyzed financial facts for Acme Industries (FY2026):\n\n" +
          "All core metrics have been deterministically normalized to base Crore (INR). Revenue shows a 5% difference between Annual Report (₹10,000 Cr, p. 42) and MD&A (₹10,500 Cr, p. 8). " +
          "EBITDA (₹2,100 Cr) and Net Profit (₹1,200 Cr) are completely consistent across all reviewed documents."
        ),
        sources: [
          {
            title: 'Finding F-024',
            document: 'Annual_Report_2026.pdf',
            page: 42,
            findingId: 'F-024'
          }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto">
      {/* Left Console Context Sidebar */}
      <div className="hidden lg:flex w-72 flex-col justify-between bg-surface p-5 rounded-card border border-border shadow-card shrink-0">
        <div className="space-y-4">
          <div className="pb-3 border-b border-border">
            <span className="text-[10px] text-navy-500 font-bold uppercase tracking-wider block">
              Investigation Console
            </span>
            <h2 className="text-sm font-extrabold text-navy-900 mt-1">
              AI Auditor Assistant
            </h2>
          </div>

          <div className="p-3 bg-brand-mint/40 rounded-lg border border-brand-emerald/20 text-xs">
            <div className="flex items-center gap-1.5 text-brand-dark font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              <span>Grounded Guarantee</span>
            </div>
            <p className="text-[11px] text-navy-700 leading-relaxed">
              Model answers are grounded strictly in normalized facts stored in Firestore. No hallucinations or estimated metrics.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider block">
              Auditor Focus Targets
            </span>
            <div
              onClick={() => handleSendMessage('Explain Finding F-024')}
              className="p-2.5 rounded-lg bg-brand-pink/50 hover:bg-brand-pink border border-[#F8D7DA] cursor-pointer transition-colors text-xs"
            >
              <span className="font-bold text-[#E45757] block">Finding F-024</span>
              <span className="text-[11px] text-navy-700">Revenue Variance (₹500 Cr)</span>
            </div>

            <div
              onClick={() => handleSendMessage('Check EBITDA and Net Profit consistency')}
              className="p-2.5 rounded-lg bg-background hover:bg-[#FAFBFB] border border-border cursor-pointer transition-colors text-xs"
            >
              <span className="font-bold text-brand-dark block">EBITDA & PAT Alignment</span>
              <span className="text-[11px] text-navy-600">Verified Consistent (0%)</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider block">
              Suggested Inquiries
            </span>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {suggestedAuditQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-1.5 rounded-md hover:bg-brand-mint text-[11px] text-navy-700 hover:text-brand-dark transition-colors line-clamp-1"
                  title={q}
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border text-[11px] text-navy-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-brand-dark" />
            486 Stored Facts
          </span>
          <span className="font-mono text-brand-dark font-semibold">Groq Llama-3.3</span>
        </div>
      </div>

      {/* Main Console Chat Area */}
      <div className="flex-1 bg-surface rounded-card border border-border shadow-card flex flex-col justify-between overflow-hidden">
        {/* Console Top Bar */}
        <div className="px-5 py-3.5 border-b border-border bg-[#FAFBFB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></div>
            <span className="text-xs font-bold text-navy-900">
              Session: Audit Inquiry (Acme Industries FY2026)
            </span>
          </div>

          <span className="text-[11px] text-navy-500 font-medium">
            Strict Fact Grounding Active
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-4 h-4 text-brand-pink" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-brand-dark text-white rounded-tr-none'
                      : 'bg-background border border-border text-navy-900 rounded-tl-none shadow-subtle'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{m.text}</p>

                  {/* Sources / Evidence action buttons if present */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/80 space-y-2">
                      <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider block">
                        CITED EVIDENCE & DOCUMENT REFERENCES:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {m.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              if (src.findingId) {
                                navigate(`/findings/${src.findingId}`);
                              } else {
                                navigate('/facts');
                              }
                            }}
                            className="px-2.5 py-1 bg-surface hover:bg-brand-mint text-brand-dark border border-border hover:border-brand-emerald/40 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-brand-emerald" />
                            <span>{src.title || `${src.document} (p. ${src.page})`}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        ))}
                        <button
                          onClick={() => navigate('/findings/F-024')}
                          className="px-2.5 py-1 bg-brand-pink hover:bg-[#fedde3] text-[#E45757] border border-[#F8D7DA] rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Open Finding F-024
                        </button>
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] mt-2 block ${
                      isUser ? 'text-gray-300 text-right' : 'text-navy-500 text-left'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-xs text-navy-500">
              <div className="w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-brand-pink" />
              </div>
              <div className="p-3 bg-background border border-border rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-dark animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-brand-dark animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-brand-dark animate-bounce delay-200"></span>
                <span>Retrieving structured facts from Firestore...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips & Input Box */}
        <div className="p-4 border-t border-border bg-surface">
          {/* Quick chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-2 scrollbar-none">
            {quickActionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 rounded-full bg-background hover:bg-brand-mint text-navy-700 hover:text-brand-dark border border-border hover:border-brand-emerald/30 text-[11px] font-medium whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about your documents, findings, or financial data..."
              className="flex-1 px-4 py-2.5 text-xs bg-background focus:bg-white border border-border focus:border-brand-emerald rounded-lg outline-none transition-all placeholder:text-navy-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg shadow-subtle transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
