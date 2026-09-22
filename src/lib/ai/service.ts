// AI Service Layer
// Architecture: Provider -> Service -> Medical Context -> Safety Layer -> Response
// Currently uses a mock/rule-based provider; swap for real LLM by implementing AIProvider

import { analyzeSafety, type SafetyResult, getDisclaimer } from "@/lib/safety";
import type { Locale } from "@/lib/i18n";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  sources?: Array<{ title: string; url?: string; author?: string }>;
  riskLevel: "low" | "medium" | "high" | "critical";
  followUpQuestions?: string[];
  shouldAskMore: boolean;
  disclaimer: string;
}

export interface AIProvider {
  generate(messages: ChatMessage[], context?: MedicalContext): Promise<string>;
}

export interface MedicalContext {
  knownSymptoms?: string[];
  duration?: string;
  severity?: number;
  patientAge?: string;
  history?: string[];
}

// Mock provider - simulates a conversational medical AI
// In production, replace this with OpenAI/Anthropic/etc via backend API
class MockMedicalAI implements AIProvider {
  private lang: Locale;

  constructor(lang: Locale = "fa") {
    this.lang = lang;
  }

  async generate(messages: ChatMessage[], context?: MedicalContext): Promise<string> {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const previousAssistantMsgs = messages.filter((m) => m.role === "assistant").length;

    const responses = this.buildResponse(lastUserMsg, previousAssistantMsgs, context);
    return responses;
  }

  private buildResponse(input: string, turnCount: number, context?: MedicalContext): string {
    const l = this.lang;
    const lowerInput = input.toLowerCase();

    // Symptom detection
    if (lowerInput.includes("سردرد") || lowerInput.includes("headache") || lowerInput.includes("kopfschmerz")) {
      if (turnCount === 0) {
        return l === "fa"
          ? "متأسفم که سردرد دارید. برای اینکه بتوانم اطلاعات مرتبط‌تری ارائه کنم، چند سؤال کوتاه می‌پرسم:\n\n• از چه زمانی شروع شده است؟\n• شدت آن چقدر است (از ۱ تا ۱۰)؟\n• آیا تب دارید؟\n• آیا حالت تهوع یا حساسیت به نور دارید؟\n• آیا اخیراً ضربه‌ای به سر وارد شده؟"
          : l === "de"
            ? "Es tut mir leid, dass Sie Kopfschmerzen haben. Um bessere Informationen liefern zu können, habe ich ein paar kurze Fragen:\n\n• Wann hat es angefangen?\n• Wie stark ist es (1-10)?\n• Haben Sie Fieber?\n• Haben Sie Übelkeit oder Lichtempfindlichkeit?\n• Gab es kürzlich ein Kopftrauma?"
            : "I'm sorry you have a headache. To provide more relevant information, I have a few short questions:\n\n• When did it start?\n• How severe is it (1-10)?\n• Do you have a fever?\n• Any nausea or sensitivity to light?\n• Any recent head injury?";
      }
      return l === "fa"
        ? "با توجه به توضیحات شما، سردرد شما می‌تواند دلایل مختلفی داشته باشد:\n\n**توضیحات احتمالی:**\n• سردرد تنشی (شایع‌ترین نوع، معمولاً با استرس مرتبط است)\n• میگرن (اغلب با تهوع و حساسیت به نور)\n• کم‌آبی بدن یا کمبود خواب\n• سینوزیت (با درد صورت و تب خفیف)\n\n**توصیه:**\nاستراحت در محیط آرام و تاریک، هیدراتاسیون کافی. در صورت تداوم بیش از ۲۴ ساعت، تشدید درد، یا همراه بودن با تب/تاری دید/ضعف، حتماً به پزشک مراجعه کنید."
        : l === "de"
          ? "Basierend auf Ihrer Beschreibung können Ihre Kopfschmerzen verschiedene Ursachen haben:\n\n**Mögliche Erklärungen:**\n• Spannungskopfschmerz (häufigste Form, oft stressbedingt)\n• Migräne (oft mit Übelkeit und Lichtempfindlichkeit)\n• Dehydration oder Schlafmangel\n• Sinusitis (mit Gesichtsschmerz und leichtem Fieber)\n\n**Empfehlung:**\nRuhe in dunkler, ruhiger Umgebung, ausreichend Flüssigkeit. Bei länger als 24 Stunden anhaltenden, sich verschlechternden Schmerzen oder mit Fieber/Sehstörungen/Schwäche einen Arzt aufsuchen."
          : "Based on your description, your headache could have several causes:\n\n**Possible explanations:**\n• Tension headache (most common, often stress-related)\n• Migraine (often with nausea and light sensitivity)\n• Dehydration or sleep deprivation\n• Sinusitis (with facial pain and mild fever)\n\n**Recommendation:**\nRest in a quiet dark room, stay hydrated. If pain persists over 24 hours, worsens, or is accompanied by fever, vision changes, or weakness — seek medical care.";
    }

    if (lowerInput.includes("گلو درد") || lowerInput.includes("sore throat") || lowerInput.includes("halsschmerz")) {
      if (turnCount === 0) {
        return l === "fa"
          ? "متأسفم که گلودرد دارید. چند سؤال کوتاه:\n\n• از چند روز پیش شروع شده؟\n• آیا تب هم دارید؟\n• آیا سرفه یا آبریزش بینی دارید؟\n• آیا بلعیدن برایتان سخت است؟"
          : l === "de"
            ? "Es tut mir leid, dass Sie Halsschmerzen haben. Ein paar kurze Fragen:\n\n• Seit wie vielen Tagen?\n• Haben Sie Fieber?\n• Haben Sie Husten oder Schnupfen?\n• Haben Sie Schluckbeschwerden?"
            : "I'm sorry you have a sore throat. A few quick questions:\n\n• How many days has it been?\n• Do you have a fever?\n• Any cough or runny nose?\n• Is it difficult to swallow?";
      }
      return l === "fa"
        ? "گلودرد اغلب به دلیل عفونت‌های ویروسی سرماخوردگی یا آنفولانزا است، اما گاهی با عفونت باکتریایی (مانند گلودرد میکروبی) نیز همراه می‌تواند باشد.\n\n**نکات مراقبتی:**\n• مایعات گرم بنوشید\n• استراحت کافی\n• غرغره آب‌نمک ولرم\n\n**در این موارد به پزشک مراجعه کنید:**\n• تب بالای ۳۸.۵ درجه\n• اشکال در تنفس یا بلع\n• بثورات پوستی\n• تداوم بیش از یک هفته"
        : l === "de"
          ? "Halsschmerzen sind oft auf virale Infektionen (Erkältung, Grippe) zurückzuführen, können aber auch bakteriell sein (z.B. Mandelentzündung).\n\n**Pflegehinweise:**\n• Warme Flüssigkeiten trinken\n• Ausreichend Ruhe\n• Mit warmem Salzwasser gurgeln\n\n**Arzt aufsuchen bei:**\n• Fieber über 38.5°C\n• Atem- oder Schluckbeschwerden\n• Hautausschlag\n• Anhalten über mehr als eine Woche"
          : "Sore throats are often caused by viral infections (cold, flu) but can sometimes be bacterial (like strep throat).\n\n**Self-care:**\n• Drink warm fluids\n• Get plenty of rest\n• Gargle with warm salt water\n\n**See a doctor if:**\n• Fever over 38.5°C/101.3°F\n• Difficulty breathing or swallowing\n• Skin rash\n• Lasts longer than a week";
    }

    if (lowerInput.includes("تب") || lowerInput.includes("fever") || lowerInput.includes("fieber")) {
      return l === "fa"
        ? "تب یک پاسخ طبیعی بدن به عفونت است. دمای طبیعی بدن حدود ۳۶.۵ تا ۳۷.۵ درجه سانتی‌گراد است.\n\n**اقدامات اولیه:**\n• استراحت و نوشیدن مایعات فراوان\n• از لباس سبک استفاده کنید\n• در صورت نیاز از استامینوفن یا ایبوپروفن طبق دستورالعمل استفاده کنید\n\n**مراجعه فوری به پزشک در صورت:**\n• تب بالای ۳۹ درجه در بزرگسالان\n• تب در نوزادان زیر ۳ ماه\n• سفتی گردن\n• تشنج\n• تداوم بیش از ۳ روز"
        : l === "de"
          ? "Fieber ist eine natürliche Reaktion des Körpers auf Infektionen. Normaltemperatur liegt bei etwa 36.5–37.5°C.\n\n**Erste Maßnahmen:**\n• Ruhen und viel trinken\n• Leichte Kleidung\n• Bei Bedarf Paracetamol oder Ibuprofen nach Packungsanweisung\n\n**Sofort zum Arzt bei:**\n• Fieber über 39°C bei Erwachsenen\n• Fieber bei Säuglingen unter 3 Monaten\n• Nackensteifigkeit\n• Krampfanfällen\n• Anhalten über 3 Tage"
          : "Fever is your body's natural response to infection. Normal body temperature is around 36.5–37.5°C (97.7–99.5°F).\n\n**Initial care:**\n• Rest and stay hydrated\n• Wear light clothing\n• Acetaminophen or ibuprofen as directed if needed\n\n**Seek immediate care if:**\n• Fever over 39°C (102.2°F) in adults\n• Fever in infants under 3 months\n• Stiff neck\n• Seizures\n• Lasts over 3 days";
    }

    if (lowerInput.includes("سرفه") || lowerInput.includes("cough") || lowerInput.includes("husten")) {
      return l === "fa"
        ? "سرفه یک مکانیسم دفاعی طبیعی است و معمولاً با سرماخوردگی یا آلرژی بهبود می‌یابد.\n\n**نکات:**\n• مایعات گرم بنوشید\n• هوای محیط را مرطوب نگه دارید\n• از محرک‌هایی مانند دود سیگار دوری کنید\n\n**نشانه‌های هشدار (مراجعه به پزشک):**\n• سرفه همراه با خون\n• تنگی نفس\n• درد قفسه سینه\n• کاهش وزن ناخواسته\n• تداوم بیش از ۳ هفته"
        : l === "de"
          ? "Husten ist ein natürlicher Abwehrmechanismus und bessert sich oft bei Erkältungen oder Allergien.\n\n**Tipps:**\n• Warme Flüssigkeiten trinken\n• Luftfeuchtigkeit erhöhen\n• Rauch und Reizstoffe meiden\n\n**Warnzeichen (Arzt aufsuchen):**\n• Bluthusten\n• Atemnot\n• Brustschmerz\n• Unbeabsichtigter Gewichtsverlust\n• Anhalten über 3 Wochen"
          : "Coughing is a natural defense mechanism and often resolves with colds or allergies.\n\n**Tips:**\n• Drink warm fluids\n• Keep the air humidified\n• Avoid irritants like smoke\n\n**Warning signs (see a doctor):**\n• Coughing up blood\n• Shortness of breath\n• Chest pain\n• Unintentional weight loss\n• Persists over 3 weeks";
    }

    if (lowerInput.includes("خستگی") || lowerInput.includes("fatigue") || lowerInput.includes("müdigkeit")) {
      return l === "fa"
        ? "خستگی می‌تواند دلایل بسیار متعددی داشته باشد، از جمله:\n• کمبود خواب\n• استرس یا اضطراب\n• کم‌آبی بدن\n• کمبود ویتامین (مانند آهن، ویتامین D، B12)\n• فعالیت بدنی شدید\n• عفونت‌های اخیر\n\n**توصیه‌های اولیه:**\nخواب منظم ۷-۹ ساعت، تغذیه متعادل، هیدراتاسیون، و فعالیت بدنی منظم. اگر خستگی بیش از ۲ هفته ادامه داشت یا با کاهش وزن، درد، یا تغییر در خلق همراه بود، به پزشک مراجعه کنید."
        : l === "de"
          ? "Müdigkeit kann viele Ursachen haben:\n• Schlafmangel\n• Stress oder Angst\n• Dehydration\n• Nährstoffmängel (Eisen, Vitamin D, B12)\n• Starke körperliche Aktivität\n• Kürzliche Infektionen\n\n**Erste Empfehlungen:**\nRegelmäßiger Schlaf (7-9 Stunden), ausgewogene Ernährung, Flüssigkeit, regelmäßige Bewegung. Suchen Sie einen Arzt auf, wenn die Müdigkeit über 2 Wochen anhält oder mit Gewichtsverlust, Schmerz oder Stimmungsveränderungen einhergeht."
          : "Fatigue can have many causes, including:\n• Lack of sleep\n• Stress or anxiety\n• Dehydration\n• Nutrient deficiencies (iron, vitamin D, B12)\n• Strenuous physical activity\n• Recent infections\n\n**Initial recommendations:**\nAim for 7-9 hours of regular sleep, balanced nutrition, hydration, and regular physical activity. If fatigue persists over 2 weeks or is accompanied by weight loss, pain, or mood changes — consult a doctor.";
    }

    if (lowerInput.includes("معده") || lowerInput.includes("دل درد") || lowerInput.includes("stomach") || lowerInput.includes("abdominal pain") || lowerInput.includes("bauchschmerz")) {
      return l === "fa"
        ? "درد معده یا شکم دلایل گوناگونی دارد:\n\n**دلایل شایع:**\n• سوءهاضمه یا نفخ\n• ویروس معده (آنفولانزای معده)\n• رفلاکس اسید\n• یبوست\n• گاستریت\n\n**نشانه‌های هشدار:**\n• درد شدید و ناگهانی\n• تب همراه با درد\n• استفراغ خونی یا مدفوع خونی\n• زردی پوست/چشم\n• درد هنگام لمس شکم\n\nاین نشانه‌ها نیاز به ارزیابی فوری پزشکی دارند."
        : l === "de"
          ? "Bauchschmerzen haben viele Ursachen:\n\n**Häufige Gründe:**\n• Verdauungsstörungen oder Blähungen\n• Magen-Darm-Virus\n• Säurereflux\n• Verstopfung\n• Gastritis\n\n**Warnzeichen:**\n• Plötzliche starke Schmerzen\n• Fieber zusammen mit Schmerzen\n• Blut im Erbrochenen oder Stuhl\n• Gelbfärbung von Haut/Augen\n• Schmerzen bei Berührung des Bauches\n\nDiese Zeichen erfordern sofortige ärztliche Untersuchung."
          : "Abdominal pain has many causes:\n\n**Common causes:**\n• Indigestion or gas\n• Stomach virus (gastroenteritis)\n• Acid reflux\n• Constipation\n• Gastritis\n\n**Warning signs:**\n• Sudden severe pain\n• Pain with fever\n• Bloody vomit or stool\n• Yellow skin/eyes\n• Pain when touching the abdomen\n\nThese require immediate medical evaluation.";
    }

    // Greeting
    if (/^(سلام|hi|hello|hallo|hey|درود)/i.test(input.trim())) {
      return l === "fa"
        ? "سلام! 👋 من دستیار هوشمند سلامت مد‌ای‌آی هستم.\n\nمن می‌توانم در موارد زیر به شما کمک کنم:\n• توضیح علائم و اطلاعات کلی پزشکی\n• درک بهتر نتایج آزمایش\n• اطلاعات عمومی داروها\n• معرفی سؤالاتی که بهتر است از پزشک خود بپرسید\n\n⚠️ یادتان باشد من پزشک نیستم و اطلاعات من جایگزین تشخیص و درمان تخصصی نمی‌شود.\n\nچه سوالی دارید؟"
        : l === "de"
          ? "Hallo! 👋 Ich bin MedAI, Ihr intelligenter Gesundheitsassistent.\n\nIch kann Ihnen helfen mit:\n• Erklärung von Symptomen und allgemeinen Gesundheitsinformationen\n• Besseres Verständnis von Laborergebnissen\n• Allgemeine Informationen zu Medikamenten\n• Fragen, die Sie Ihrem Arzt stellen sollten\n\n⚠️ Denken Sie daran: Ich bin kein Arzt, und meine Informationen ersetzen keine ärztliche Diagnose oder Behandlung.\n\nWas möchten Sie besprechen?"
          : "Hello! 👋 I'm MedAI, your intelligent health assistant.\n\nI can help you with:\n• Understanding symptoms and general health information\n• Making sense of lab results\n• General medication information\n• Suggesting questions to ask your doctor\n\n⚠️ Remember: I'm not a doctor, and my information does not replace professional medical diagnosis or treatment.\n\nWhat would you like to discuss?";
    }

    // Generic response for unrecognized inputs
    if (turnCount === 0) {
      return l === "fa"
        ? "متشکرم که پیامتان را به اشتراک گذاشتید. برای اینکه بتوانم دقیق‌تر و مفیدتر پاسخ دهم، لطفاً کمی بیشتر توضیح دهید:\n\n• علائم اصلی شما چیست؟\n• از چه زمانی شروع شده‌اند؟\n• شدت آن‌ها چقدر است؟\n• آیا علائم دیگری هم دارید؟\n• آیا سابقه بیماری خاص یا مصرف دارو دارید؟\n\nهر چه اطلاعات دقیق‌تر باشد، بهتر می‌توانم راهنمایی کنم."
          : l === "de"
            ? "Vielen Dank für Ihre Nachricht. Um genauer und hilfreicher antworten zu können, erläutern Sie bitte etwas mehr:\n\n• Was sind Ihre Hauptsymptome?\n• Wann haben sie begonnen?\n• Wie stark sind sie?\n• Haben Sie weitere Symptome?\n• Haben Sie Vorerkrankungen oder nehmen Sie Medikamente?\n\nJe genauer die Informationen, desto besser kann ich Sie unterstützen."
            : "Thank you for sharing. To respond more accurately and helpfully, could you tell me a bit more:\n\n• What are your main symptoms?\n• When did they start?\n• How severe are they?\n• Do you have other symptoms?\n• Any pre-existing conditions or medications?\n\nThe more specific you are, the better I can help.";
    }

    return l === "fa"
      ? "با توجه به اطلاعاتی که دادید، این‌ها نکات کلی هستند:\n\nبر اساس توضیحات شما، علائم می‌توانند دلایل متعددی داشته باشند که اغلب خفیف و گذرا هستند. اما برای تشخیص دقیق، معاینه توسط پزشک ضروری است.\n\n**توصیه‌های کلی:**\n• استراحت کافی داشته باشید\n• مایعات فراوان بنوشید\n• در صورت تداوم یا تشدید علائم، به پزشک مراجعه کنید\n• اگر علائم هشداردهنده‌ای مانند تنگی نفس، درد قفسه سینه، یا تب بالا دارید، فوراً به مراکز درمانی مراجعه کنید\n\nآیا سؤال دیگری دارید؟"
      : l === "de"
        ? "Basierend auf Ihren Angaben hier allgemeine Hinweise:\n\nIhre Symptome können verschiedene, oft leichte und vorübergehende Ursachen haben. Für eine genaue Diagnose ist jedoch eine ärztliche Untersuchung erforderlich.\n\n**Allgemeine Empfehlungen:**\n• Ausreichend Ruhe\n• Viel Flüssigkeit trinken\n• Bei anhaltenden oder sich verschlechternden Symptomen einen Arzt aufsuchen\n• Bei Warnzeichen wie Atemnot, Brustschmerz oder hohem Fieber sofort einen Notdienst kontaktieren\n\nHaben Sie weitere Fragen?"
        : "Based on the information you've shared, here are general points:\n\nYour symptoms can have multiple causes, often mild and temporary. But for an accurate diagnosis, an in-person exam by a doctor is necessary.\n\n**General recommendations:**\n• Get adequate rest\n• Stay hydrated\n• If symptoms persist or worsen, consult a doctor\n• If you experience warning signs like shortness of breath, chest pain, or high fever, seek immediate medical care\n\nDo you have any other questions?";
  }
}

// Simple in-memory RAG-style context retrieval (mock)
function retrieveMedicalContext(query: string): Array<{ title: string; url?: string; author?: string; snippet: string }> {
  const sources = [
    {
      title: "WHO - Headache Disorders",
      url: "https://www.who.int/news-room/fact-sheets/detail/headache-disorders",
      author: "World Health Organization",
      keywords: ["headache", "سردرد", "migraine", "میگرن", "tension"],
    },
    {
      title: "CDC - Sore Throat",
      url: "https://www.cdc.gov/",
      author: "Centers for Disease Control and Prevention",
      keywords: ["sore throat", "گلو درد", "strep", "throat"],
    },
    {
      title: "NHS - Fever in adults",
      url: "https://www.nhs.uk/conditions/fever-in-adults/",
      author: "NHS UK",
      keywords: ["fever", "تب", "temperature", "high temperature"],
    },
    {
      title: "Mayo Clinic - Fatigue",
      url: "https://www.mayoclinic.org/symptoms/fatigue/basics/definition/sym-20050894",
      author: "Mayo Clinic",
      keywords: ["fatigue", "خستگی", "tiredness", "exhaustion"],
    },
    {
      title: "Johns Hopkins - Abdominal Pain",
      url: "https://www.hopkinsmedicine.org/",
      author: "Johns Hopkins Medicine",
      keywords: ["abdominal", "stomach", "معده", "دل درد", "belly"],
    },
  ];

  const lower = query.toLowerCase();
  return sources
    .filter((s) => s.keywords.some((k) => lower.includes(k)))
    .map(({ keywords: _kw, ...rest }) => ({ ...rest, snippet: "Reference guideline on evaluation and management." }));
}

// Main AI service function
export async function generateMedicalResponse(
  messages: ChatMessage[],
  locale: Locale = "fa",
  context?: MedicalContext
): Promise<AIResponse> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  // 1. Safety Layer (independent, runs before AI)
  const safety = analyzeSafety(lastUserMessage, locale);

  // If critical, block normal flow and return urgent guidance
  if (safety.riskLevel === "critical") {
    return {
      content: `🚨 **${locale === "fa" ? "توجه فوری" : locale === "de" ? "Dringender Hinweis" : "Urgent Attention"}**\n\n${safety.urgentMessage}\n\n${safety.recommendation}`,
      riskLevel: "critical",
      shouldAskMore: false,
      disclaimer: getDisclaimer(locale),
    };
  }

  // 2. Retrieve medical context (RAG)
  const retrievedSources = retrieveMedicalContext(lastUserMessage);

  // 3. Generate response via provider
  const provider = new MockMedicalAI(locale);
  const content = await provider.generate(messages, context);

  // Count user messages to determine follow-up needs
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const assistantMessageCount = messages.filter((m) => m.role === "assistant").length;

  // 4. Build follow-up questions
  const followUpQuestions = generateFollowUpQuestions(lastUserMessage, assistantMessageCount, locale);

  // 5. Append safety recommendation if high risk
  let finalContent = content;
  if (safety.riskLevel === "high") {
    const highNote =
      locale === "fa"
        ? `\n\n---\n🟡 **نکته مهم:** ${safety.recommendation}`
        : locale === "de"
          ? `\n\n---\n🟡 **Wichtiger Hinweis:** ${safety.recommendation}`
          : `\n\n---\n🟡 **Important note:** ${safety.recommendation}`;
    finalContent = finalContent + highNote;
  }

  return {
    content: finalContent,
    sources: retrievedSources.length > 0 ? retrievedSources : undefined,
    riskLevel: safety.riskLevel,
    followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
    shouldAskMore: userMessageCount < 2 && assistantMessageCount < 2 && !lastUserMessage.includes("؟") && !lastUserMessage.includes("?"),
    disclaimer: getDisclaimer(locale),
  };
}

function generateFollowUpQuestions(input: string, assistantTurns: number, locale: Locale): string[] {
  if (assistantTurns > 0) return [];
  const lower = input.toLowerCase();

  const questions: Record<string, Record<Locale, string[]>> = {
    headache: {
      fa: ["شدت سردرد شما چقدر است؟", "آیا با حالت تهوع همراه است؟", "از چه زمانی شروع شده؟"],
      en: ["How severe is your headache?", "Is it accompanied by nausea?", "When did it start?"],
      de: ["Wie stark sind Ihre Kopfschmerzen?", "Begleitet von Übelkeit?", "Wann hat es angefangen?"],
    },
    soreThroat: {
      fa: ["آیا تب دارید؟", "آیا بلعیدن دشوار است؟"],
      en: ["Do you have a fever?", "Is it difficult to swallow?"],
      de: ["Haben Sie Fieber?", "Haben Sie Schluckbeschwerden?"],
    },
  };

  if (lower.includes("سردرد") || lower.includes("headache")) return questions.headache[locale];
  if (lower.includes("گلو") || lower.includes("throat") || lower.includes("hals")) return questions.soreThroat[locale];
  return [];
}

// Symptom checker wizard logic
export function generateSymptomResult(
  data: {
    ageRange: string;
    mainSymptom: string;
    duration: string;
    severity: number;
    associatedSymptoms: string[];
    medicalContext: string;
  },
  locale: Locale = "fa"
) {
  const explanations = generatePossibleExplanations(data.mainSymptom, locale);
  const urgency = determineUrgency(data.severity, data.associatedSymptoms, data.duration, locale);

  return {
    explanations,
    urgency,
    disclaimer: getDisclaimer(locale),
  };
}

function generatePossibleExplanations(symptom: string, locale: Locale) {
  const l = locale;
  const map: Record<string, Array<{ condition: string; relevance: string }>> = {
    headache: [
      {
        condition: l === "fa" ? "سردرد تنشی" : l === "de" ? "Spannungskopfschmerz" : "Tension headache",
        relevance:
          l === "fa"
            ? "شایع‌ترین نوع سردرد؛ معمولاً با فشار در اطراف سر و مرتبط با استرس، خستگی، یا وضعیت بدنی نامناسب."
            : l === "de"
              ? "Häufigste Kopfschmerzart; oft druckend um den Kopf, verbunden mit Stress, Müdigkeit oder schlechter Haltung."
              : "Most common type; usually pressure around the head, linked to stress, fatigue, or poor posture.",
      },
      {
        condition: l === "fa" ? "میگرن" : l === "de" ? "Migräne" : "Migraine",
        relevance:
          l === "fa"
            ? "سردرد ضربان‌دار معمولاً یک‌طرفه، گاهی با تهوع، حساسیت به نور و صدا. می‌تواند با عوامل محیطی یا غذایی تحریک شود."
            : l === "de"
              ? "Pochende, oft einseitige Kopfschmerzen, manchmal mit Übelkeit, Licht- und Geräuschempfindlichkeit."
              : "Throbbing, often one-sided headache, sometimes with nausea, sensitivity to light and sound.",
      },
      {
        condition: l === "fa" ? "سینوزیت" : l === "de" ? "Sinusitis" : "Sinusitis",
        relevance:
          l === "fa"
            ? "درد و فشار در صورت، پیشانی یا گونه‌ها؛ معمولاً با گرفتگی بینی و ترشح."
            : l === "de"
              ? "Schmerz und Druck im Gesicht, Stirn oder Wangen; oft mit Nasenverstopfung und Ausfluss."
              : "Pain and pressure in the face, forehead, or cheeks; often with nasal congestion and discharge.",
      },
    ],
    default: [
      {
        condition: l === "fa" ? "علت ویروسی" : l === "de" ? "Virale Ursache" : "Viral cause",
        relevance:
          l === "fa"
            ? "بسیاری از علائم خفیف به دلیل عفونت‌های ویروسی هستند که معمولاً با استراحت بهبود می‌یابند."
            : l === "de"
              ? "Viele leichte Symptome gehen auf virale Infektionen zurück und bessern sich mit Ruhe."
              : "Many mild symptoms are due to viral infections that typically resolve with rest.",
      },
      {
        condition: l === "fa" ? "عوامل محیطی/سبک زندگی" : l === "de" ? "Umwelt-/Lebensstilfaktoren" : "Environmental/lifestyle factors",
        relevance:
          l === "fa"
            ? "کم‌آبی بدن، کمبود خواب، استرس، یا آلرژی می‌توانند طیف وسیعی از علائم ایجاد کنند."
            : l === "de"
              ? "Dehydration, Schlafmangel, Stress oder Allergien können eine Reihe von Symptomen verursachen."
              : "Dehydration, poor sleep, stress, or allergies can produce a wide range of symptoms.",
      },
    ],
  };

  const key = symptom.toLowerCase().includes("سردرد") || symptom.toLowerCase().includes("headache")
    ? "headache"
    : "default";

  return map[key];
}

function determineUrgency(
  severity: number,
  associated: string[],
  duration: string,
  locale: Locale
): { level: "routine" | "consult" | "urgent"; label: string; description: string } {
  const l = locale;
  const hasRedFlag = associated.some((s) =>
    ["تنگی نفس", "درد قفسه سینه", "گیجی", "shortness of breath", "chest pain", "confusion", "atemnot", "brustschmerz"].some(
      (f) => s.toLowerCase().includes(f)
    )
  );

  if (hasRedFlag || severity >= 9) {
    return {
      level: "urgent",
      label: l === "fa" ? "🔴 مراقبت فوری پزشکی" : l === "de" ? "🔴 Sofortige ärztliche Hilfe" : "🔴 Seek urgent medical attention",
      description:
        l === "fa"
          ? "علائم شما ممکن است نشان‌دهنده یک وضعیت جدی باشد. لطفاً فوراً به اورژانس یا پزشک مراجعه کنید."
          : l === "de"
            ? "Ihre Symptome könnten auf einen ernsten Zustand hinweisen. Bitte suchen Sie sofort einen Notarzt auf."
            : "Your symptoms may indicate a serious condition. Please seek immediate medical care.",
    };
  }

  if (severity >= 6 || duration.includes("week") || duration.includes("هفته") || duration.includes("woche")) {
    return {
      level: "consult",
      label: l === "fa" ? "🟡 مشورت با پزشک" : l === "de" ? "🟡 Arzt konsultieren" : "🟡 Consider medical consultation",
      description:
        l === "fa"
          ? "توصیه می‌کنیم در روزهای آینده با پزشک مشورت کنید تا علائم شما بررسی شود."
          : l === "de"
            ? "Wir empfehlen, in den nächsten Tagen einen Arzt aufzusuchen."
            : "We recommend consulting a doctor in the coming days to evaluate your symptoms.",
    };
  }

  return {
    level: "routine",
    label: l === "fa" ? "🟢 مراقبت عادی" : l === "de" ? "🟢 Routine" : "🟢 Routine",
    description:
      l === "fa"
        ? "علائم شما خفیف به نظر می‌رسند. با استراحت و مراقبت در منزل معمولاً بهبود می‌یابند. در صورت تشدید، با پزشک مشورت کنید."
        : l === "de"
          ? "Ihre Symptome scheinen mild zu sein. Mit Ruhe und häuslicher Pflege bessern sie sich oft. Bei Verschlechterung einen Arzt aufsuchen."
          : "Your symptoms appear mild. They usually improve with rest and home care. Consult a doctor if they worsen.",
  };
}

// Lab analyzer mock
export function analyzeLabText(text: string, locale: Locale = "fa") {
  const items = parseMockLabItems(text, locale);
  return {
    title: locale === "fa" ? "نتایج آزمایش شما" : locale === "de" ? "Ihre Laborergebnisse" : "Your Lab Results",
    items,
    summary:
      locale === "fa"
        ? "این تحلیل کلی بر اساس مقادیر وارد شده است. برای تفسیر کامل حتماً با پزشک خود مشورت کنید."
        : locale === "de"
          ? "Dies ist eine allgemeine Analyse basierend auf den eingegebenen Werten. Für eine vollständige Interpretation konsultieren Sie bitte Ihren Arzt."
          : "This is a general analysis based on the entered values. Please consult your doctor for complete interpretation.",
    questions: [
      locale === "fa" ? "آیا این مقادیر نسبت به آزمایش قبلی تغییر کرده‌اند؟" : locale === "de" ? "Haben sich diese Werte seit dem letzten Test verändert?" : "Have these values changed since your last test?",
      locale === "fa" ? "با توجه به نتایج، آیا نیازی به تکرار آزمایش هست؟" : locale === "de" ? "Ist aufgrund der Ergebnisse eine Wiederholung des Tests erforderlich?" : "Based on the results, should the test be repeated?",
      locale === "fa" ? "تغییر در سبک زندگی یا رژیم غذایی لازم است؟" : locale === "de" ? "Sind Änderungen im Lebensstil oder in der Ernährung erforderlich?" : "Are any lifestyle or diet changes needed?",
    ],
  };
}

function parseMockLabItems(text: string, locale: Locale) {
  const items: Array<{ name: string; value: string; unit: string; status: "normal" | "high" | "low"; note: string; refRange: string }> = [];
  const lower = text.toLowerCase();

  const l = locale;
  const normalLabel = l === "fa" ? "در محدوده طبیعی" : l === "de" ? "Im Referenzbereich" : "Within reference range";
  const highLabel = l === "fa" ? "بالاتر از محدوده" : l === "de" ? "Über dem Referenzbereich" : "Above reference range";
  const lowLabel = l === "fa" ? "پایین‌تر از محدوده" : l === "de" ? "Unter dem Referenzbereich" : "Below reference range";

  // Basic pattern recognition for common markers
  if (lower.includes("hemoglobin") || lower.includes("هموگلوبین") || lower.includes("hb")) {
    const match = text.match(/(\d+\.?\d*)\s*(g\/d|g\/dl|گرم)/i);
    const val = match ? parseFloat(match[1]) : 13.5;
    items.push({
      name: l === "fa" ? "هموگلوبین" : "Hemoglobin",
      value: String(val),
      unit: "g/dL",
      status: val >= 12 && val <= 17 ? "normal" : val < 12 ? "low" : "high",
      refRange: "12.0 - 17.5 g/dL",
      note: val < 12
        ? (l === "fa" ? "ممکن است نشان‌دهنده کم‌خونی باشد. با پزشک خود مشورت کنید." : l === "de" ? "Kann auf Anämie hinweisen. Bitte Arzt konsultieren." : "May indicate anemia. Consult your doctor.")
        : normalLabel,
    });
  }

  if (lower.includes("glucose") || lower.includes("قند") || lower.includes("blood sugar") || lower.includes("blutzucker")) {
    const match = text.match(/(\d+\.?\d*)\s*(mg|mmol|mg\/dl)/i);
    const val = match ? parseFloat(match[1]) : 95;
    items.push({
      name: l === "fa" ? "قند خون ناشتا" : "Fasting Glucose",
      value: String(val),
      unit: "mg/dL",
      status: val < 100 ? "normal" : val < 126 ? "high" : "high",
      refRange: "70 - 99 mg/dL",
      note: val >= 100
        ? (l === "fa" ? "در محدوده پیش‌دیابت یا بالاتر. با پزشک خود در مورد رژیم و پیگیری مشورت کنید." : l === "de" ? "Im Prädiabetes-Bereich oder höher. Besprechen Sie Ernährung und Nachsorge mit Ihrem Arzt." : "In pre-diabetes range or higher. Discuss diet and follow-up with your doctor.")
        : normalLabel,
    });
  }

  if (lower.includes("cholesterol") || lower.includes("کلسترول")) {
    const match = text.match(/(\d+\.?\d*)\s*(mg|mg\/dl)/i);
    const val = match ? parseFloat(match[1]) : 190;
    items.push({
      name: l === "fa" ? "کلسترول تام" : "Total Cholesterol",
      value: String(val),
      unit: "mg/dL",
      status: val < 200 ? "normal" : "high",
      refRange: "< 200 mg/dL",
      note: val >= 200 ? highLabel : normalLabel,
    });
  }

  if (lower.includes("wbc") || lower.includes("white blood") || lower.includes("گلبول سفید")) {
    const match = text.match(/(\d+\.?\d*)\s*(×?\s*10)/i);
    const val = match ? parseFloat(match[1]) : 7.2;
    items.push({
      name: l === "fa" ? "گلبول‌های سفید (WBC)" : "White Blood Cells",
      value: String(val),
      unit: "×10³/µL",
      status: val >= 4 && val <= 11 ? "normal" : val < 4 ? "low" : "high",
      refRange: "4.0 - 11.0 ×10³/µL",
      note: normalLabel,
    });
  }

  if (items.length === 0) {
    items.push({
      name: l === "fa" ? "تحلیل کلی" : "General analysis",
      value: "—",
      unit: "",
      status: "normal",
      refRange: "",
      note: l === "fa"
        ? "من نتوانستم مقادیر آزمایش خاصی را تشخیص دهم. لطفاً مقادیر را با نام و عدد به صورت واضح‌تر وارد کنید یا با پزشک خود مشورت کنید."
        : l === "de"
          ? "Ich konnte keine spezifischen Laborwerte erkennen. Bitte geben Sie die Werte mit Name und Zahl deutlicher ein oder konsultieren Sie Ihren Arzt."
          : "I couldn't recognize specific lab values. Please enter values with name and number more clearly, or consult your doctor.",
    });
  }

  return items;
}

// Mock medication database
export const MEDICATIONS_MOCK = [
  {
    id: "1",
    name: { fa: "استامینوفن (پاراستامول)", en: "Acetaminophen (Paracetamol)", de: "Paracetamol" },
    genericName: "Acetaminophen",
    drugClass: "Analgesic, Antipyretic",
    uses: {
      fa: ["تب", "درد خفیف تا متوسط", "سردرد", "درد عضلانی", "دندان‌درد"],
      en: ["Fever", "Mild to moderate pain", "Headache", "Muscle aches", "Toothache"],
      de: ["Fieber", "Leichte bis mäßige Schmerzen", "Kopfschmerz", "Muskelschmerzen", "Zahnschmerz"],
    },
    forms: {
      fa: ["قرص", "شربت", "شیاف"],
      en: ["Tablet", "Liquid", "Suppository"],
      de: ["Tablette", "Saft", "Zäpfchen"],
    },
    warnings: {
      fa: [
        "بیش از دوز توصیه‌شده مصرف نکنید (خطر آسیب کبدی)",
        "در صورت بیماری کبدی با پزشک مشورت کنید",
        "مصرف همزمان با سایر داروهای حاوی استامینوفن خودداری شود",
      ],
      en: [
        "Do not exceed recommended dose (risk of liver damage)",
        "Consult a doctor if you have liver disease",
        "Avoid combining with other acetaminophen-containing products",
      ],
      de: [
        "Empfohlene Dosis nicht überschreiten (Risiko von Leberschäden)",
        "Bei Lebererkrankungen Arzt konsultieren",
        "Nicht mit anderen paracetamolhaltigen Produkten kombinieren",
      ],
    },
    sideEffects: {
      fa: ["عموماً در دوز مناسب خوب تحمل می‌شود", "به ندرت واکنش آلرژیک"],
      en: ["Generally well-tolerated at proper doses", "Rarely allergic reactions"],
      de: ["In der Regel in richtiger Dosierung gut verträglich", "Selten allergische Reaktionen"],
    },
    interactions: {
      fa: ["الکل (افزایش خطر آسیب کبدی)", "کاربامازپین"],
      en: ["Alcohol (increased liver damage risk)", "Carbamazepine"],
      de: ["Alkohol (erhöhtes Leberschadensrisiko)", "Carbamazepin"],
    },
    whenToTalk: {
      fa: [
        "اگر تب بیش از ۳ روز ادامه یافت",
        "اگر درد بیش از ۱۰ روز ادامه یافت",
        "در صورت بروز علائم حساسیت (جوش، تورم صورت، تنگی نفس)",
      ],
      en: [
        "If fever lasts more than 3 days",
        "If pain lasts more than 10 days",
        "If signs of allergy appear (rash, facial swelling, difficulty breathing)",
      ],
      de: [
        "Wenn Fieber länger als 3 Tage andauert",
        "Wenn Schmerzen länger als 10 Tage andauern",
        "Bei Anzeichen einer Allergie (Ausschlag, Gesichtsschwellung, Atemnot)",
      ],
    },
  },
  {
    id: "2",
    name: { fa: "ایبوپروفن", en: "Ibuprofen", de: "Ibuprofen" },
    genericName: "Ibuprofen",
    drugClass: "NSAID (Non-steroidal anti-inflammatory)",
    uses: {
      fa: ["درد", "التهاب", "تب", "درد قاعدگی", "آرتریت"],
      en: ["Pain", "Inflammation", "Fever", "Menstrual cramps", "Arthritis"],
      de: ["Schmerzen", "Entzündungen", "Fieber", "Regelschmerzen", "Arthritis"],
    },
    forms: { fa: ["قرص", "کپسول", "شربت"], en: ["Tablet", "Capsule", "Liquid"], de: ["Tablette", "Kapsel", "Saft"] },
    warnings: {
      fa: [
        "در صورت زخم معده یا سابقه خونریزی گوارشی احتیاط شود",
        "در سه‌ماهه سوم بارداری مصرف نشود",
        "مصرف طولانی‌مدت ممکن است بر کلیه یا قلب تأثیر بگذارد",
      ],
      en: [
        "Use caution if you have stomach ulcers or history of GI bleeding",
        "Do not use in the third trimester of pregnancy",
        "Long-term use may affect kidneys or heart",
      ],
      de: [
        "Vorsicht bei Magengeschwüren oder gastrointestinalen Blutungen in der Vorgeschichte",
        "Nicht im dritten Schwangerschaftsdrittel anwenden",
        "Langzeitanwendung kann Nieren oder Herz beeinträchtigen",
      ],
    },
    sideEffects: {
      fa: ["ناراحتی معده", "سوزش سردل", "سرگیجه (با مصرف طولانی‌مدت)"],
      en: ["Stomach upset", "Heartburn", "Dizziness (with long-term use)"],
      de: ["Magenverstimmung", "Sodbrennen", "Schwindel (bei Langzeitanwendung)"],
    },
    interactions: {
      fa: ["آسپرین", "وارفارین", "لیتیوم", "داروهای فشار خون"],
      en: ["Aspirin", "Warfarin", "Lithium", "Blood pressure medications"],
      de: ["Aspirin", "Warfarin", "Lithium", "Blutdruckmittel"],
    },
    whenToTalk: {
      fa: [
        "در صورت درد معده مداوم",
        "مدفوع سیاه یا خونی",
        "واکنش آلرژیک",
        "قبل از مصرف در صورت بیماری قلبی، کلیوی، یا گوارشی",
      ],
      en: [
        "If you have persistent stomach pain",
        "Black or bloody stools",
        "Allergic reaction",
        "Before use if you have heart, kidney, or GI disease",
      ],
      de: [
        "Bei anhaltenden Magenschmerzen",
        "Schwarzer oder blutiger Stuhl",
        "Allergische Reaktion",
        "Vor Anwendung bei Herz-, Nieren- oder Darmerkrankungen",
      ],
    },
  },
  {
    id: "3",
    name: { fa: "آموکسی‌سیلین", en: "Amoxicillin", de: "Amoxicillin" },
    genericName: "Amoxicillin",
    drugClass: "Penicillin Antibiotic",
    uses: {
      fa: ["عفونت‌های باکتریایی (گلو، گوش، ریه، مجاری ادراری)", "فقط با تجویز پزشک"],
      en: ["Bacterial infections (throat, ear, lung, urinary tract)", "Prescription only"],
      de: ["Bakterielle Infektionen (Hals, Ohr, Lunge, Harnwege)", "Nur auf Rezept"],
    },
    forms: { fa: ["کپسول", "شربت"], en: ["Capsule", "Liquid"], de: ["Kapsel", "Saft"] },
    warnings: {
      fa: [
        "فقط برای عفونت باکتریایی است (روی ویروس سرماخوردگی/آنفولانزا اثری ندارد)",
        "در صورت آلرژی به پنی‌سیلین مصرف نشود",
        "دوره درمان را کامل کنید حتی اگر احساس بهبودی دارید",
      ],
      en: [
        "Only for bacterial infections (does not work on cold/flu viruses)",
        "Do not use if allergic to penicillin",
        "Complete the full course even if you feel better",
      ],
      de: [
        "Nur bei bakteriellen Infektionen (wirkt nicht bei Erkältungs-/Grippeviren)",
        "Nicht bei Penicillinallergie anwenden",
        "Vollständige Behandlung auch bei Besserung abschließen",
      ],
    },
    sideEffects: {
      fa: ["اسهال", "حالت تهوع", "جوش پوستی (در صورت بروز، قطع کنید و با پزشک تماس بگیرید)"],
      en: ["Diarrhea", "Nausea", "Skin rash (if it occurs, stop and call your doctor)"],
      de: ["Durchfall", "Übelkeit", "Hautausschlag (bei Auftreten absetzen und Arzt anrufen)"],
    },
    interactions: { fa: ["متوترکسات", "پروبنسید"], en: ["Methotrexate", "Probenecid"], de: ["Methotrexat", "Probenecid"] },
    whenToTalk: {
      fa: [
        "اسهال شدید یا آبکی",
        "جوش یا کهیر",
        "تنگی نفس یا تورم صورت",
        "عدم بهبودی پس از اتمام دوره",
      ],
      en: ["Severe or watery diarrhea", "Rash or hives", "Difficulty breathing or facial swelling", "No improvement after course"],
      de: ["Schwerer oder wässriger Durchfall", "Ausschlag oder Nesselsucht", "Atemnot oder Gesichtsschwellung", "Keine Besserung nach Therapieende"],
    },
  },
];
