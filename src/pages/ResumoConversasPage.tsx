import React, { useEffect, useMemo } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ArrowLeft, MessageSquare, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDashboard } from '../store/useStore';

const normalizeParagraphs = (text?: string) => {
  if (!text) {
    return [];
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  const segments = trimmed
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÇ])/u));

  return segments
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const parseDateValue = (value?: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const parsedIso = parseISO(value);
    if (isValid(parsedIso)) {
      return parsedIso;
    }
  } catch (_) {
    // Ignora parseISO inválido e tenta fallback abaixo
  }

  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
};

const formatDateLabel = (value?: string | null) => {
  const parsed = parseDateValue(value);
  if (!parsed) return null;

  const hasTimeInfo = Boolean(value && value.includes('T'));
  const dateText = format(parsed, 'dd/MM/yyyy');
  return hasTimeInfo ? `${dateText} às ${format(parsed, 'HH:mm')}` : dateText;
};

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const ResumoConversasPage: React.FC = () => {
  const {
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    loadResumoConversas,
    closeResumoConversas,
    openFullChat
  } = useDashboard();

  useEffect(() => {
    if (!resumoConversas && !resumoConversasLoading && !resumoConversasError) {
      loadResumoConversas().catch(() => null);
    }
  }, [resumoConversas, resumoConversasLoading, resumoConversasError, loadResumoConversas]);

  const conversasDetalhadas = useMemo(() => {
    if (!resumoConversas?.conversas) {
      return [];
    }

    const reservas = new Set(['resumo_conversa', 'data_conversa']);

    const totalConversas = resumoConversas.conversas.length;

    return resumoConversas.conversas.map((conversa, index) => {
      const rawId = conversa.id as string | number | undefined;
      const key = rawId !== undefined
        ? String(rawId)
        : conversa.data_conversa
          ? String(conversa.data_conversa)
          : `conversa-${index}`;

      const resumoTexto = typeof conversa.resumo_conversa === 'string'
        ? conversa.resumo_conversa
        : conversa.resumo_conversa !== null && conversa.resumo_conversa !== undefined
          ? String(conversa.resumo_conversa)
          : '';

      const paragraphs = normalizeParagraphs(resumoTexto);
      const dataFormatada = formatDateLabel(typeof conversa.data_conversa === 'string' ? conversa.data_conversa : null);
      const extras = Object.entries(conversa)
        .filter(([key, value]) => !reservas.has(key) && value !== null && value !== undefined)
        .map(([key, value]) => ({ key, value }));

      return {
        key,
        indice: totalConversas - index,
        dataFormatada,
        paragraphs,
        extras: extras.filter((e) => e.key !== 'id' && e.key !== 'chat_id'),
        chatId: rawId ? String(rawId) : null
      };
    });
  }, [resumoConversas]);

  const extraSections = useMemo(() => {
    if (!resumoConversas?.extras) return [];
    return Object.entries(resumoConversas.extras)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({ key, value }));
  }, [resumoConversas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={closeResumoConversas}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="p-6 border-b border-white/40 flex items-start gap-3 bg-white/60">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageSquare className="text-blue-600" size={20} />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Resumo das conversa</h2>
              <p className="text-sm text-gray-600 mt-1">
                Síntese das conversas identificadas pelo MindQuest, destacando contextos,
                emoções e apoios em andamento.
              </p>
            </div>

            <button
              onClick={() => loadResumoConversas().catch(() => null)}
              disabled={resumoConversasLoading}
              className="flex items-center gap-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={resumoConversasLoading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>

          <div className="p-6 space-y-6">
            {resumoConversasLoading && (
              <div className="text-center text-sm text-gray-500">Carregando resumo…</div>
            )}

            {resumoConversasError && (
              <div className="text-center text-sm text-red-500">
                {resumoConversasError}
              </div>
            )}

            {!resumoConversasLoading && !resumoConversasError && conversasDetalhadas.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                Nenhum resumo disponível para este momento.
              </div>
            )}

            {!resumoConversasLoading && !resumoConversasError && conversasDetalhadas.length > 0 && (
              <div className="space-y-6">
                {conversasDetalhadas.map((conversa) => (
                  <div
                    key={conversa.key}
                    className="border border-white/40 rounded-xl bg-white/70 p-4 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <MessageSquare size={16} className="text-blue-600" />
                        <span>Conversa {conversa.indice}</span>
                      </div>
                      {conversa.dataFormatada && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {conversa.dataFormatada}
                        </span>
                      )}
                    </div>

                    {conversa.paragraphs.length > 0 && (
                      <div className="space-y-3">
                    {conversa.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                    {conversa.extras.length > 0 && (
                      <div className="space-y-3 border-t border-white/50 pt-3">
                        {conversa.extras.map(({ key, value }) => {
                          if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
                            return (
                              <div key={key}>
                                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                  {formatLabel(key)}
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {value.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }

                          if (Array.isArray(value) && value.every((item) => item && typeof item === 'object')) {
                            return (
                              <div key={key}>
                                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                  {formatLabel(key)}
                                </h3>
                                <div className="space-y-2">
                                  {value.map((item, idx) => (
                                    <pre
                                      key={idx}
                                      className="whitespace-pre-wrap break-words text-xs text-gray-600 bg-white/80 rounded-lg p-3"
                                    >
                                      {JSON.stringify(item, null, 2)}
                                    </pre>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          if (value && typeof value === 'object') {
                            return (
                              <div key={key}>
                                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                  {formatLabel(key)}
                                </h3>
                                <pre className="whitespace-pre-wrap break-words text-xs text-gray-600 bg-white/80 rounded-lg p-3">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              </div>
                            );
                          }

                          const textValue = String(value);
                          if (!textValue.trim()) {
                            return null;
                          }

                          return (
                            <div key={key}>
                              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                {formatLabel(key)}
                              </h3>
                              <p className="text-sm text-gray-700">{textValue}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* Link para conversa completa se existir chat_id nos extras */}
                    {(() => {
                      const chatId = conversa.chatId;
                      if (!chatId) return null;
                      return (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => openFullChat(chatId)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Ver conversa completa
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}

            {extraSections.length > 0 && (
              <div className="space-y-4">
                {extraSections.map(({ key, value }) => {
                  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
                    return (
                      <div key={key} className="bg-white/60 border border-white/40 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">{formatLabel(key)}</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {value.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  if (
                    Array.isArray(value) &&
                    value.every((item) => item && typeof item === 'object')
                  ) {
                    return (
                      <div key={key} className="bg-white/60 border border-white/40 rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-800">{formatLabel(key)}</h3>
                        <div className="space-y-3">
                          {value.map((item, idx) => (
                            <div key={idx} className="rounded-lg bg-white/80 p-3 text-sm text-gray-700">
                              <pre className="whitespace-pre-wrap break-words text-xs text-gray-600">
                                {JSON.stringify(item, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (value && typeof value === 'object') {
                    return (
                      <div key={key} className="bg-white/60 border border-white/40 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">{formatLabel(key)}</h3>
                        <pre className="whitespace-pre-wrap break-words text-xs text-gray-600">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    );
                  }

                  const textValue = String(value);

                  if (!textValue.trim()) {
                    return null;
                  }

                  return (
                    <div key={key} className="bg-white/60 border border-white/40 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">{formatLabel(key)}</h3>
                      <p className="text-sm text-gray-700">{textValue}</p>
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

export default ResumoConversasPage;
