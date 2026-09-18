import { createContext, createElement, useContext, type ReactNode } from 'react'

export type Locale = 'ko' | 'en' | 'ja' | 'es' | 'de' | 'pt-BR'

type Messages = {
  appTitle: string
  newSession: string
  createFirstSession: string
  emptyLineOne: string
  emptyLineTwo: string
  nodeCount: (count: number) => string
  justNow: string
  minutesAgo: (count: number) => string
  hoursAgo: (count: number) => string
  sessionTitle: string
  goToSessionList: string
  undo: string
  copyPrompt: string
  language: string
  languageTitle: string
  languageDescription: string
  close: string
  saveFailed: string
  canvasHint: string
  addNode: string
  note: string
  branch: string
  exception: string
  paste: string
  copied: string
  copyFailed: string
  confirmDelete: string
  deleteSession: (title: string) => string
  copyNode: string
  cutNode: string
  deleteNode: string
  thoughtPlaceholder: string
  deleteEdge: string
}

const messages: Record<Locale, Messages> = {
  ko: {
    appTitle: '생각 캔버스',
    newSession: '새 세션',
    createFirstSession: '첫 세션 만들기',
    emptyLineOne: '사고 과정을 노드로 기록하고,',
    emptyLineTwo: '복사해서 AI에게 피드백 받으세요.',
    nodeCount: (count) => `노드 ${count}개`,
    justNow: '방금',
    minutesAgo: (count) => `${count}분 전`,
    hoursAgo: (count) => `${count}시간 전`,
    sessionTitle: '세션 제목',
    goToSessionList: '세션 목록으로',
    undo: '되돌리기',
    copyPrompt: '생각 검토 프롬프트 복사',
    language: '언어',
    languageTitle: '언어 설정',
    languageDescription: 'Think Canvas에서 사용할 언어를 선택하세요.',
    close: '닫기',
    saveFailed: '저장하지 못했습니다. 기기 저장공간을 확인하세요.',
    canvasHint: '빈 곳을 더블탭하거나 + 버튼으로 첫 생각을 추가하세요',
    addNode: '노드 추가',
    note: '생각',
    branch: '분기',
    exception: '예외',
    paste: '붙여넣기',
    copied: '검토 프롬프트를 복사했습니다.',
    copyFailed: '복사하지 못했습니다. 브라우저 권한을 확인하세요.',
    confirmDelete: '삭제 확인',
    deleteSession: (title) => `${title} 삭제`,
    copyNode: '복사',
    cutNode: '잘라내기',
    deleteNode: '노드 삭제',
    thoughtPlaceholder: '생각 입력…',
    deleteEdge: '연결 삭제',
  },
  en: {
    appTitle: 'Think Canvas',
    newSession: 'New session',
    createFirstSession: 'Create your first session',
    emptyLineOne: 'Capture your thinking as nodes,',
    emptyLineTwo: 'then copy it to get AI feedback.',
    nodeCount: (count) => `${count} ${count === 1 ? 'node' : 'nodes'}`,
    justNow: 'Just now',
    minutesAgo: (count) => `${count}m ago`,
    hoursAgo: (count) => `${count}h ago`,
    sessionTitle: 'Session title',
    goToSessionList: 'Back to sessions',
    undo: 'Undo',
    copyPrompt: 'Copy review prompt',
    language: 'Language',
    languageTitle: 'Language',
    languageDescription: 'Choose the language for Think Canvas.',
    close: 'Close',
    saveFailed: 'Could not save. Check your device storage.',
    canvasHint: 'Double-tap an empty area or use + to add your first thought',
    addNode: 'Add node',
    note: 'Thought',
    branch: 'Branch',
    exception: 'Exception',
    paste: 'Paste',
    copied: 'Review prompt copied.',
    copyFailed: 'Could not copy. Check your browser permissions.',
    confirmDelete: 'Confirm delete',
    deleteSession: (title) => `Delete ${title}`,
    copyNode: 'Copy',
    cutNode: 'Cut',
    deleteNode: 'Delete node',
    thoughtPlaceholder: 'Write a thought…',
    deleteEdge: 'Delete connection',
  },
  ja: {
    appTitle: 'Think Canvas',
    newSession: '新しいセッション',
    createFirstSession: '最初のセッションを作成',
    emptyLineOne: '思考をノードとして記録し、',
    emptyLineTwo: 'コピーしてAIからフィードバックを受け取ります。',
    nodeCount: (count) => `ノード ${count}個`,
    justNow: 'たった今',
    minutesAgo: (count) => `${count}分前`,
    hoursAgo: (count) => `${count}時間前`,
    sessionTitle: 'セッション名',
    goToSessionList: 'セッション一覧に戻る',
    undo: '元に戻す',
    copyPrompt: 'レビュー用プロンプトをコピー',
    language: '言語',
    languageTitle: '言語設定',
    languageDescription: 'Think Canvasで使用する言語を選択してください。',
    close: '閉じる',
    saveFailed: '保存できませんでした。端末のストレージを確認してください。',
    canvasHint: '空白をダブルタップするか、+ボタンで最初の思考を追加してください',
    addNode: 'ノードを追加',
    note: '思考',
    branch: '分岐',
    exception: '例外',
    paste: '貼り付け',
    copied: 'レビュー用プロンプトをコピーしました。',
    copyFailed: 'コピーできませんでした。ブラウザの権限を確認してください。',
    confirmDelete: '削除を確認',
    deleteSession: (title) => `${title}を削除`,
    copyNode: 'コピー',
    cutNode: '切り取り',
    deleteNode: 'ノードを削除',
    thoughtPlaceholder: '思考を入力…',
    deleteEdge: '接続を削除',
  },
  es: {
    appTitle: 'Think Canvas',
    newSession: 'Nueva sesión',
    createFirstSession: 'Crear tu primera sesión',
    emptyLineOne: 'Registra tus ideas como nodos',
    emptyLineTwo: 'y cópialas para recibir comentarios de la IA.',
    nodeCount: (count) => `${count} ${count === 1 ? 'nodo' : 'nodos'}`,
    justNow: 'Ahora mismo',
    minutesAgo: (count) => `hace ${count} min`,
    hoursAgo: (count) => `hace ${count} h`,
    sessionTitle: 'Título de la sesión',
    goToSessionList: 'Volver a las sesiones',
    undo: 'Deshacer',
    copyPrompt: 'Copiar prompt de revisión',
    language: 'Idioma',
    languageTitle: 'Configuración de idioma',
    languageDescription: 'Elige el idioma de Think Canvas.',
    close: 'Cerrar',
    saveFailed: 'No se pudo guardar. Revisa el almacenamiento del dispositivo.',
    canvasHint: 'Toca dos veces un espacio vacío o usa + para añadir tu primera idea',
    addNode: 'Añadir nodo',
    note: 'Idea',
    branch: 'Rama',
    exception: 'Excepción',
    paste: 'Pegar',
    copied: 'Prompt de revisión copiado.',
    copyFailed: 'No se pudo copiar. Revisa los permisos del navegador.',
    confirmDelete: 'Confirmar eliminación',
    deleteSession: (title) => `Eliminar ${title}`,
    copyNode: 'Copiar',
    cutNode: 'Cortar',
    deleteNode: 'Eliminar nodo',
    thoughtPlaceholder: 'Escribe una idea…',
    deleteEdge: 'Eliminar conexión',
  },
  de: {
    appTitle: 'Think Canvas',
    newSession: 'Neue Sitzung',
    createFirstSession: 'Erste Sitzung erstellen',
    emptyLineOne: 'Halte deine Gedanken als Knoten fest',
    emptyLineTwo: 'und kopiere sie für KI-Feedback.',
    nodeCount: (count) => `${count} ${count === 1 ? 'Knoten' : 'Knoten'}`,
    justNow: 'Gerade eben',
    minutesAgo: (count) => `vor ${count} Min.`,
    hoursAgo: (count) => `vor ${count} Std.`,
    sessionTitle: 'Sitzungstitel',
    goToSessionList: 'Zur Sitzungsübersicht',
    undo: 'Rückgängig',
    copyPrompt: 'Prüfungs-Prompt kopieren',
    language: 'Sprache',
    languageTitle: 'Spracheinstellungen',
    languageDescription: 'Wähle die Sprache für Think Canvas.',
    close: 'Schließen',
    saveFailed: 'Speichern nicht möglich. Prüfe den Speicherplatz deines Geräts.',
    canvasHint: 'Doppeltippe auf eine freie Fläche oder nutze + für deinen ersten Gedanken',
    addNode: 'Knoten hinzufügen',
    note: 'Gedanke',
    branch: 'Abzweigung',
    exception: 'Ausnahme',
    paste: 'Einfügen',
    copied: 'Prüfungs-Prompt kopiert.',
    copyFailed: 'Kopieren nicht möglich. Prüfe die Browserberechtigungen.',
    confirmDelete: 'Löschen bestätigen',
    deleteSession: (title) => `${title} löschen`,
    copyNode: 'Kopieren',
    cutNode: 'Ausschneiden',
    deleteNode: 'Knoten löschen',
    thoughtPlaceholder: 'Gedanken eingeben…',
    deleteEdge: 'Verbindung löschen',
  },
  'pt-BR': {
    appTitle: 'Think Canvas',
    newSession: 'Nova sessão',
    createFirstSession: 'Criar sua primeira sessão',
    emptyLineOne: 'Registre seus pensamentos como nós',
    emptyLineTwo: 'e copie para receber feedback da IA.',
    nodeCount: (count) => `${count} ${count === 1 ? 'nó' : 'nós'}`,
    justNow: 'Agora mesmo',
    minutesAgo: (count) => `há ${count} min`,
    hoursAgo: (count) => `há ${count} h`,
    sessionTitle: 'Título da sessão',
    goToSessionList: 'Voltar para as sessões',
    undo: 'Desfazer',
    copyPrompt: 'Copiar prompt de revisão',
    language: 'Idioma',
    languageTitle: 'Configurações de idioma',
    languageDescription: 'Escolha o idioma do Think Canvas.',
    close: 'Fechar',
    saveFailed: 'Não foi possível salvar. Verifique o armazenamento do dispositivo.',
    canvasHint: 'Toque duas vezes em uma área vazia ou use + para adicionar seu primeiro pensamento',
    addNode: 'Adicionar nó',
    note: 'Pensamento',
    branch: 'Ramificação',
    exception: 'Exceção',
    paste: 'Colar',
    copied: 'Prompt de revisão copiado.',
    copyFailed: 'Não foi possível copiar. Verifique as permissões do navegador.',
    confirmDelete: 'Confirmar exclusão',
    deleteSession: (title) => `Excluir ${title}`,
    copyNode: 'Copiar',
    cutNode: 'Recortar',
    deleteNode: 'Excluir nó',
    thoughtPlaceholder: 'Digite um pensamento…',
    deleteEdge: 'Excluir conexão',
  },
}

export const languageNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  es: 'Español',
  de: 'Deutsch',
  'pt-BR': 'Português (Brasil)',
}

const LOCALE_KEY = 'think-canvas:locale'

// Temporarily ship Korean only; retain translations and saved preferences for re-enabling.
export const MULTILINGUAL_ENABLED = false

export function getInitialLocale(): Locale {
  if (!MULTILINGUAL_ENABLED) return 'ko'
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && saved in messages) return saved as Locale
  } catch {
    // localStorage may be unavailable in private browsing.
  }

  const language = navigator.language.toLowerCase()
  if (language.startsWith('ko')) return 'ko'
  if (language.startsWith('ja')) return 'ja'
  if (language.startsWith('es')) return 'es'
  if (language.startsWith('de')) return 'de'
  if (language.startsWith('pt')) return 'pt-BR'
  return 'en'
}

export function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // The current session still follows the selected language.
  }
}

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Messages
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({
  locale,
  setLocale,
  children,
}: {
  locale: Locale
  setLocale: (locale: Locale) => void
  children: ReactNode
}) {
  return createElement(I18nContext.Provider, { value: { locale, setLocale, t: messages[locale] } }, children)
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}

export function formatRelativeTime(timestamp: number, locale: Locale): string {
  const diffMinutes = Math.floor((Date.now() - timestamp) / 60000)
  if (diffMinutes < 1) return messages[locale].justNow
  if (diffMinutes < 60) return messages[locale].minutesAgo(diffMinutes)
  if (diffMinutes < 24 * 60) return messages[locale].hoursAgo(Math.floor(diffMinutes / 60))

  return new Intl.DateTimeFormat(locale, {
    month: 'numeric',
    day: 'numeric',
  }).format(timestamp)
}

export function getDefaultSessionTitle(locale: Locale, month: number, day: number): string {
  const date = `${month}/${day}`
  switch (locale) {
    case 'ko': return `${date} 생각`
    case 'ja': return `${date}の思考`
    case 'es': return `${date} ideas`
    case 'de': return `${date} Gedanken`
    case 'pt-BR': return `${date} pensamentos`
    default: return `${date} thoughts`
  }
}

export function getReviewPrompt(title: string, locale: Locale): string[] {
  switch (locale) {
    case 'ko':
      return [
        `다음은 제가 "${title}"에 대해 생각하고 정리한 내용입니다.`, '',
        '이러한 생각을 하고 있는데, 사고 과정을 검토해 주세요.',
        '- 논리적 비약이나 모순이 있는지 확인해 주세요.',
        '- 놓친 전제, 고려할 점, 위험 요소를 짚어 주세요.',
        '- 다른 관점이나 반론을 제시해 주세요.',
        '- 다음에 확인하거나 실행할 일을 제안해 주세요.', '',
        '기록에 명시된 사실과 나의 추정·가설·질문을 구분해 주세요. 사실로 적힌 내용도 검증된 근거가 있는지는 별도로 판단해 주세요.',
        '빠진 맥락은 임의로 채우지 말고 확인 질문으로 남겨 주세요. 연결 화살표를 반드시 인과관계로 해석하지 마세요.',
        '타당한 부분도 근거와 함께 짚어 주세요. 가장 중요한 불확실성을 최대 3개로 추리고, 각각을 검증할 수 있는 가장 작은 다음 행동과 확인할 결과를 제안해 주세요.',
        '',
        '생각 앞 번호는 떠올린 순서를 적어 둔 것일 뿐입니다. "4번"처럼 번호로 가리키지 말고, 그 생각의 내용을 직접 인용하거나 풀어서 말해 주세요.', '',
        '구체적인 피드백과 함께 더 나은 사고 흐름이 있다면 제안해 주세요.', '', '---', '',
      ]
    case 'ja':
      return [
        `以下は「${title}」について私が考え、整理した内容です。`, '',
        'この思考の流れをレビューしてください。',
        '- 論理の飛躍や矛盾がないか確認してください。',
        '- 見落としている前提、考慮点、リスクを指摘してください。',
        '- 別の視点や反論を示してください。',
        '- 次に確認または実行すべきことを提案してください。', '',
        '具体的なフィードバックと、より良い思考の進め方があれば提案してください。', '', '---', '',
      ]
    case 'es':
      return [
        `Estas son mis ideas sobre "${title}".`, '',
        'Por favor, revisa mi línea de pensamiento.',
        '- Señala saltos lógicos o contradicciones.',
        '- Identifica supuestos, aspectos o riesgos que falten.',
        '- Ofrece perspectivas alternativas o contraargumentos.',
        '- Sugiere qué debería verificar o hacer a continuación.', '',
        'Dame comentarios concretos y sugiere un razonamiento más sólido si lo ves posible.', '', '---', '',
      ]
    case 'de':
      return [
        `Hier ist, wie ich über "${title}" nachgedacht habe.`, '',
        'Bitte überprüfe diesen Gedankengang.',
        '- Zeige logische Lücken oder Widersprüche auf.',
        '- Identifiziere fehlende Annahmen, Aspekte oder Risiken.',
        '- Nenne alternative Perspektiven oder Gegenargumente.',
        '- Schlage vor, was ich als Nächstes prüfen oder tun sollte.', '',
        'Gib konkretes Feedback und schlage einen besseren Gedankengang vor, falls du einen siehst.', '', '---', '',
      ]
    case 'pt-BR':
      return [
        `Estas são minhas ideias sobre "${title}".`, '',
        'Por favor, revise minha linha de raciocínio.',
        '- Aponte lacunas lógicas ou contradições.',
        '- Identifique premissas, pontos ou riscos que estejam faltando.',
        '- Ofereça perspectivas alternativas ou contra-argumentos.',
        '- Sugira o que devo verificar ou fazer em seguida.', '',
        'Forneça um feedback específico e sugira um raciocínio melhor, se houver.', '', '---', '',
      ]
    default:
      return [
        `Here is how I have been thinking about "${title}".`, '',
        'Please review this line of thinking.',
        '- Point out logical gaps or contradictions.',
        '- Identify missing assumptions, considerations, or risks.',
        '- Offer alternative perspectives or counterarguments.',
        '- Suggest what I should verify or do next.', '',
        'Please give specific feedback and suggest a stronger line of reasoning if you see one.', '', '---', '',
      ]
  }
}

/** Short enough to fit inside the node ghost in every supported locale. */
export function getDropPreviewLabel(locale: Locale, overlapping: boolean): string {
  const labels: Record<Locale, [string, string]> = {
    ko: ['여기에 새 생각', '다른 노드와 겹침'],
    en: ['New thought here', 'Overlaps another node'],
    ja: ['ここに新しい考え', '他のノードと重なります'],
    es: ['Nueva idea aquí', 'Se superpone a un nodo'],
    de: ['Neuer Gedanke hier', 'Überlappt einen Knoten'],
    'pt-BR': ['Nova ideia aqui', 'Sobrepõe outro nó'],
  }
  return labels[locale][overlapping ? 1 : 0]
}
