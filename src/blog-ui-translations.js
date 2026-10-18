const keys = ['home','readArticle','backBlog','relatedProject','blogApiExcerpt','blogLiveExcerpt','blogDesktopExcerpt'];
const copy = {
  es:['Inicio','Leer artículo','Volver al blog','Proyecto relacionado','Una entrada común para integrar modelos de lenguaje en otras aplicaciones.','Conectar eventos de streaming con herramientas y experiencias interactivas.','Explorar el puente entre una interfaz web y una ventana de escritorio.'],
  en:['Home','Read article','Back to blog','Related project','A common entry point for integrating language models into other applications.','Connecting streaming events with tools and interactive experiences.','Exploring the bridge between a web interface and a desktop window.'],
  pt:['Início','Ler artigo','Voltar ao blog','Projeto relacionado','Uma entrada comum para integrar modelos de linguagem a outras aplicações.','Conectar eventos de transmissão a ferramentas e experiências interativas.','Explorar a ponte entre uma interface web e uma janela de desktop.'],
  fr:['Accueil','Lire l’article','Retour au blog','Projet associé','Un point d’entrée commun pour intégrer des modèles de langage à d’autres applications.','Relier les événements de diffusion à des outils et à des expériences interactives.','Explorer le lien entre une interface web et une fenêtre de bureau.'],
  de:['Start','Artikel lesen','Zurück zum Blog','Zugehöriges Projekt','Ein gemeinsamer Zugang zur Integration von Sprachmodellen in andere Anwendungen.','Streaming-Ereignisse mit Werkzeugen und interaktiven Erlebnissen verbinden.','Die Verbindung zwischen einer Weboberfläche und einem Desktop-Fenster erkunden.'],
  zh:['首页','阅读文章','返回博客','相关项目','通过统一入口将语言模型集成到其他应用中。','将直播事件与工具和互动体验连接起来。','探索网页界面与桌面窗口之间的桥梁。'],
  ja:['ホーム','記事を読む','ブログに戻る','関連プロジェクト','共通の入口から言語モデルを他のアプリに組み込む。','配信イベントをツールやインタラクティブな体験につなぐ。','ウェブの画面とデスクトップのウィンドウをつなぐ仕組みを探る。'],
  ko:['홈','글 읽기','블로그로 돌아가기','관련 프로젝트','공통 진입점을 통해 언어 모델을 다른 앱에 통합하기.','스트리밍 이벤트를 도구와 인터랙티브한 경험으로 연결하기.','웹 인터페이스와 데스크톱 창을 잇는 연결 탐구하기.'],
  ar:['الرئيسية','قراءة المقال','العودة إلى المدونة','المشروع المرتبط','مدخل موحّد لدمج نماذج اللغة في التطبيقات الأخرى.','ربط أحداث البث بالأدوات والتجارب التفاعلية.','استكشاف الجسر بين واجهة الويب ونافذة سطح المكتب.'],
  hi:['होम','लेख पढ़ें','ब्लॉग पर वापस जाएँ','संबंधित प्रोजेक्ट','भाषा मॉडल को दूसरे ऐप में जोड़ने के लिए एक साझा प्रवेश बिंदु।','स्ट्रीमिंग इवेंट को टूल और इंटरैक्टिव अनुभवों से जोड़ना।','वेब इंटरफ़ेस और डेस्कटॉप विंडो के बीच का पुल समझना।']
};
export const blogUiTranslations = Object.fromEntries(Object.entries(copy).map(([locale,values])=>{
  if(values.length !== keys.length) throw new Error(`Incomplete blog UI: ${locale}`);
  return [locale,Object.fromEntries(keys.map((key,index)=>[key,values[index]]))];
}));
