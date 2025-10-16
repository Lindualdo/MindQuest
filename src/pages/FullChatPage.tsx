import React, { useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDashboard } from '../store/useStore';

const FullChatPage: React.FC = () => {
  const { fullChatDetail, fullChatLoading, fullChatError, selectedChatId, closeFullChat, openFullChat } = useDashboard();

  useEffect(() => {
    if (!fullChatDetail && selectedChatId && !fullChatLoading) {
      openFullChat(selectedChatId).catch(() => null);
    }
  }, [fullChatDetail, selectedChatId, fullChatLoading, openFullChat]);

  const conversa = fullChatDetail as any;
  const mensagensOrig: Array<any> = conversa?.mensagens || [];
  const mensagens: Array<any> = mensagensOrig.length > 0 ? mensagensOrig.slice(0, -1) : mensagensOrig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={closeFullChat} className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft size={18} /> Voltar
        </button>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="p-6 border-b border-white/40 flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <MessageCircle className="text-blue-600" size={20} /> Conversa completa
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {conversa?.data_conversa ? new Date(conversa.data_conversa).toLocaleString() : 'Data indisponível'} • {conversa?.emoji_dia || ''}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {fullChatLoading && (
              <div className="text-center text-sm text-gray-500">Carregando conversa…</div>
            )}
            {fullChatError && (
              <div className="text-center text-sm text-red-500">{fullChatError}</div>
            )}

            {!fullChatLoading && !fullChatError && mensagens.length === 0 && (
              <div className="text-center text-sm text-gray-500">Nenhuma mensagem encontrada.</div>
            )}

            {!fullChatLoading && !fullChatError && mensagens.length > 0 && (
              <div className="space-y-3">
                {mensagens.map((m, idx) => {
                  const isUser = (m.autor || '').toLowerCase() === 'usuario';
                  return (
                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} shadow-sm rounded-2xl px-4 py-2 max-w-[80%]`}> 
                        <div className="text-xs opacity-70 mb-1">{isUser ? 'Você' : 'MindQuest'} • {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}</div>
                        <div className="text-sm whitespace-pre-wrap">{m.texto}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FullChatPage;
