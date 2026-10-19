// Short starter articles grounded in the portfolio's public repositories.
const keys = ['blog', 'blogApiTitle', 'blogApiBody', 'blogLiveTitle', 'blogLiveBody', 'blogDesktopTitle', 'blogDesktopBody'];
const copy = {
  es: [
    'Blog',
    'Una interfaz para conectar modelos',
    'Una interfaz común ayuda a separar una aplicación de los detalles de su integración. freellmapiV2 ofrece un endpoint compatible con OpenAI para conectar modelos de lenguaje con otras aplicaciones. La idea de diseño es mantener una entrada reconocible y concentrar el trabajo de integración detrás de ella.',
    'Del evento en vivo a una herramienta',
    'Un chat, un regalo o un seguimiento pueden ser el inicio de una interacción. wshook-extension captura eventos de TikTok Live, Twitch y Kick y los envía a un webhook o una ventana independiente. Separar la captura del destino permite pensar en cada herramienta como una parte de una experiencia mayor.',
    'La web también puede vivir en el escritorio',
    'Una interfaz web no tiene que quedarse en una pestaña del navegador. webview-napi proporciona bindings para Node.js sobre tao y wry. Este tipo de puente permite explorar aplicaciones que combinan una interfaz web con una ventana de escritorio, y pensar por separado en la presentación y la integración con el entorno.'
  ],
  en: [
    'Blog',
    'One interface for connecting models',
    'A shared interface helps separate an application from its integration details. freellmapiV2 provides an OpenAI-compatible endpoint for connecting language models to other applications. The design idea is to keep a recognizable entry point and concentrate the integration work behind it.',
    'From a live event to a tool',
    'A chat message, gift, or follow can start an interaction. wshook-extension captures events from TikTok Live, Twitch, and Kick, then forwards them to a webhook or a separate window. Separating capture from destination lets each tool become part of a larger experience.',
    'The web can live on the desktop too',
    'A web interface does not have to stay in a browser tab. webview-napi provides Node.js bindings built on tao and wry. This kind of bridge opens up applications that combine a web interface with a desktop window, letting presentation and integration with the environment be considered separately.'
  ],
  pt: [
    'Blog',
    'Uma interface para conectar modelos',
    'Uma interface comum ajuda a separar uma aplicação dos detalhes da integração. freellmapiV2 oferece um endpoint compatível com OpenAI para conectar modelos de linguagem a outras aplicações. A ideia é manter uma entrada reconhecível e concentrar o trabalho de integração por trás dela.',
    'Do evento ao vivo a uma ferramenta',
    'Uma mensagem, um presente ou um novo seguidor podem iniciar uma interação. wshook-extension captura eventos do TikTok Live, Twitch e Kick e os envia a um webhook ou a uma janela separada. Separar a captura do destino permite que cada ferramenta faça parte de uma experiência maior.',
    'A web também pode viver no desktop',
    'Uma interface web não precisa ficar em uma aba do navegador. webview-napi fornece bindings para Node.js baseados em tao e wry. Essa ponte permite explorar aplicações que combinam uma interface web com uma janela de desktop, considerando separadamente a apresentação e a integração com o ambiente.'
  ],
  fr: [
    'Blog',
    'Une interface pour connecter les modèles',
    'Une interface commune aide à séparer une application des détails de son intégration. freellmapiV2 propose un point d’accès compatible avec OpenAI pour relier les modèles de langage à d’autres applications. L’idée est de conserver une entrée reconnaissable et de regrouper le travail d’intégration derrière elle.',
    'D’un événement en direct à un outil',
    'Un message, un cadeau ou un nouvel abonné peuvent déclencher une interaction. wshook-extension capture les événements de TikTok Live, Twitch et Kick, puis les transmet à un webhook ou à une fenêtre distincte. Séparer la capture de la destination permet à chaque outil de participer à une expérience plus large.',
    'Le web peut aussi vivre sur le bureau',
    'Une interface web ne doit pas forcément rester dans un onglet. webview-napi fournit des bindings Node.js basés sur tao et wry. Ce pont permet d’explorer des applications associant une interface web et une fenêtre de bureau, en distinguant la présentation de l’intégration à l’environnement.'
  ],
  de: [
    'Blog',
    'Eine Schnittstelle für Sprachmodelle',
    'Eine gemeinsame Schnittstelle hilft, eine Anwendung von Integrationsdetails zu trennen. freellmapiV2 bietet einen OpenAI-kompatiblen Endpunkt, um Sprachmodelle mit anderen Anwendungen zu verbinden. Die Gestaltungsidee: einen vertrauten Zugang beibehalten und die Integrationsarbeit dahinter bündeln.',
    'Vom Live-Ereignis zum Werkzeug',
    'Eine Chatnachricht, ein Geschenk oder ein neuer Follower können eine Interaktion auslösen. wshook-extension erfasst Ereignisse von TikTok Live, Twitch und Kick und leitet sie an einen Webhook oder ein separates Fenster weiter. Die Trennung von Erfassung und Ziel macht jedes Werkzeug zum Teil eines größeren Erlebnisses.',
    'Das Web findet auch auf dem Desktop Platz',
    'Eine Weboberfläche muss nicht im Browser bleiben. webview-napi stellt Node.js-Bindings auf Basis von tao und wry bereit. Diese Brücke ermöglicht Anwendungen, die eine Weboberfläche mit einem Desktop-Fenster verbinden, und trennt die Gestaltung der Oberfläche von der Einbindung in die Umgebung.'
  ],
  zh: [
    '博客',
    '用统一接口连接模型',
    '统一的接口有助于将应用与集成细节分开。freellmapiV2 提供兼容 OpenAI 的接口，将语言模型连接到其他应用。这个设计思路保留了一个容易识别的入口，并将集成工作集中在入口背后。',
    '从直播事件到实用工具',
    '一条聊天消息、一份礼物或一次关注，都可以成为互动的起点。wshook-extension 捕获 TikTok Live、Twitch 和 Kick 的事件，并转发到 webhook 或独立窗口。将事件捕获与目的地分开，让每个工具都能成为更大体验的一部分。',
    '网页也可以成为桌面应用',
    '网页界面不必局限于浏览器标签页。webview-napi 基于 tao 和 wry，为 Node.js 提供绑定。这座桥梁让我们可以探索将网页界面与桌面窗口结合的应用，并分别考虑界面呈现与运行环境的集成。'
  ],
  ja: [
    'ブログ',
    '共通のインターフェースでモデルをつなぐ',
    '共通のインターフェースは、アプリケーションと連携の詳細を切り分けるのに役立ちます。freellmapiV2 は、言語モデルを他のアプリにつなぐ OpenAI 互換のエンドポイントを提供します。使い慣れた入口を保ち、その裏側に連携の処理をまとめるという設計です。',
    'ライブのイベントをツールにつなぐ',
    'チャット、ギフト、フォローは、インタラクションのきっかけになります。wshook-extension は TikTok Live、Twitch、Kick のイベントを取得し、webhook や別ウィンドウへ転送します。取得と送信先を切り分けることで、個々のツールをより大きな体験の一部として考えられます。',
    'ウェブはデスクトップにも広がる',
    'ウェブの画面は、ブラウザのタブにとどまる必要はありません。webview-napi は tao と wry を使った Node.js バインディングを提供します。この橋渡しにより、ウェブの画面とデスクトップのウィンドウを組み合わせ、表示と環境への連携を分けて考えられます。'
  ],
  ko: [
    '블로그',
    '하나의 인터페이스로 모델 연결하기',
    '공통 인터페이스는 애플리케이션과 연동 세부 사항을 분리하는 데 도움이 됩니다. freellmapiV2는 언어 모델을 다른 앱에 연결하는 OpenAI 호환 엔드포인트를 제공합니다. 익숙한 진입점을 유지하고 그 뒤에서 연동 작업을 처리하는 설계입니다.',
    '라이브 이벤트를 도구로 연결하기',
    '채팅 메시지, 선물, 팔로우는 상호작용의 시작점이 될 수 있습니다. wshook-extension은 TikTok Live, Twitch, Kick의 이벤트를 수집해 webhook이나 별도 창으로 전달합니다. 수집과 목적지를 분리하면 각 도구를 더 큰 경험의 일부로 생각할 수 있습니다.',
    '웹은 데스크톱에서도 살아갑니다',
    '웹 인터페이스가 브라우저 탭 안에만 있어야 하는 것은 아닙니다. webview-napi는 tao와 wry 기반의 Node.js 바인딩을 제공합니다. 이 연결을 통해 웹 화면과 데스크톱 창을 결합하고, 화면 표현과 실행 환경 연동을 따로 고려할 수 있습니다.'
  ],
  ar: [
    'المدونة',
    'واجهة واحدة لربط النماذج',
    'تساعد الواجهة المشتركة على فصل التطبيق عن تفاصيل التكامل. يوفّر freellmapiV2 نقطة وصول متوافقة مع OpenAI لربط نماذج اللغة بالتطبيقات الأخرى. الفكرة التصميمية هي الحفاظ على مدخل مألوف وتجميع عمل التكامل خلفه.',
    'من حدث مباشر إلى أداة',
    'يمكن لرسالة أو هدية أو متابعة أن تبدأ تفاعلًا. تلتقط wshook-extension أحداث TikTok Live وTwitch وKick وترسلها إلى webhook أو نافذة منفصلة. فصل التقاط الحدث عن وجهته يتيح النظر إلى كل أداة بوصفها جزءًا من تجربة أوسع.',
    'الويب يمكنه أيضًا أن يعيش على سطح المكتب',
    'ليس على واجهة الويب أن تبقى داخل علامة تبويب في المتصفح. يوفّر webview-napi روابط لـ Node.js مبنية على tao وwry. يتيح هذا الجسر استكشاف تطبيقات تجمع واجهة ويب ونافذة سطح مكتب، مع التفكير في العرض والتكامل مع البيئة بشكل منفصل.'
  ],
  hi: [
    'ब्लॉग',
    'एक इंटरफ़ेस से मॉडल जोड़ना',
    'एक साझा इंटरफ़ेस ऐप्लिकेशन को इंटीग्रेशन की बारीकियों से अलग रखने में मदद करता है। freellmapiV2 भाषा मॉडल को दूसरे ऐप से जोड़ने के लिए OpenAI-संगत एंडपॉइंट देता है। डिज़ाइन का विचार है कि एक परिचित प्रवेश बिंदु बना रहे और इंटीग्रेशन का काम उसके पीछे हो।',
    'लाइव इवेंट से एक टूल तक',
    'चैट संदेश, गिफ़्ट या फ़ॉलो किसी इंटरैक्शन की शुरुआत हो सकते हैं। wshook-extension, TikTok Live, Twitch और Kick के इवेंट कैप्चर करके उन्हें webhook या अलग विंडो में भेजता है। कैप्चर और गंतव्य को अलग रखने से हर टूल एक बड़े अनुभव का हिस्सा बन सकता है।',
    'वेब डेस्कटॉप पर भी रह सकता है',
    'वेब इंटरफ़ेस को ब्राउज़र टैब तक सीमित रहने की ज़रूरत नहीं है। webview-napi, tao और wry पर आधारित Node.js बाइंडिंग देता है। यह पुल वेब इंटरफ़ेस और डेस्कटॉप विंडो को जोड़ने वाले ऐप की संभावनाएँ खोलता है, ताकि प्रस्तुति और परिवेश से जुड़ाव पर अलग-अलग विचार किया जा सके।'
  ]
};
export const blogTranslations = Object.fromEntries(Object.entries(copy).map(([locale, values]) => {
  if(values.length !== keys.length) throw new Error(`Incomplete blog locale: ${locale}`);
  return [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
}));
