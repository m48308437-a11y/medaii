// Safety Engine - Independent rule-based risk detection
// Never diagnoses, only flags urgent conditions and routes to emergency care

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface SafetyResult {
  riskLevel: RiskLevel;
  triggeredRules: string[];
  urgentMessage?: string;
  shouldBlockNormalFlow: boolean;
  recommendation: string;
}

interface CriticalRule {
  patterns: string[];
  messages: Record<"fa" | "en" | "de", string>;
}

const CRITICAL_RULES: CriticalRule[] = [
  {
    patterns: [
      "chest pain", "درد قفسه سینه", "درد سینه", "فشار روی سینه",
      "brustschmerz", "schmerz in der brust",
      "درد قلب", "heart attack", "حمله قلبی",
    ],
    messages: {
      fa: "درد قفسه سینه می‌تواند نشانه یک وضعیت اورژانسی باشد. لطفاً فوراً با اورژانس تماس بگیرید یا به نزدیک‌ترین مرکز درمانی مراجعه کنید.",
      en: "Chest pain can indicate a medical emergency. Please call emergency services immediately or go to the nearest emergency room.",
      de: "Brustschmerzen können auf einen Notfall hinweisen. Bitte rufen Sie sofort den Notdienst an oder suchen Sie die nächste Notaufnahme auf.",
    },
  },
  {
    patterns: [
      "difficulty breathing", "shortness of breath", "نفس تنگی", "سختی تنفس", "نمی‌توانم نفس بکشم",
      "atemnot", "schwierigkeiten beim atmen", "cannot breathe", "can't breathe",
    ],
    messages: {
      fa: "تنگی نفس شدید یا دشواری در تنفس یک علامت هشداردهنده جدی است. لطفاً فوراً با اورژانس تماس بگیرید.",
      en: "Severe difficulty breathing is a serious warning sign. Please call emergency services immediately.",
      de: "Schwere Atemnot ist ein ernstes Warnzeichen. Bitte rufen Sie sofort den Notdienst an.",
    },
  },
  {
    patterns: [
      "stroke", "سکته", "نیمه صورت فلج", "ضعف ناگهانی", "تکلم نامفهوم", "یک طرف بدن",
      "schlaganfall", "plötzliche schwäche", "sprachstörung", "face drooping",
      "sudden weakness", "slurred speech", "نامفهوم صحبت کردن",
    ],
    messages: {
      fa: "علائمی که توصیف کردید می‌توانند نشانه سکته باشند. در صورت سکته هر دقیقه اهمیت دارد. فوراً با اورژانس تماس بگیرید.",
      en: "The symptoms you describe could indicate a stroke. Every minute matters with stroke symptoms. Call emergency services immediately.",
      de: "Die beschriebenen Symptome könnten auf einen Schlaganfall hinweisen. Jede Minute zählt. Rufen Sie sofort den Notdienst an.",
    },
  },
  {
    patterns: [
      "suicide", "kill myself", "می‌خواهم خودم را بکشم", "به پایان دادن فکر می‌کنم",
      "selbstmord", "mich umbringen", "خودکشی", "پایان دادن به زندگی",
      "end my life", "want to die",
    ],
    messages: {
      fa: "اگر شما یا کسی که می‌شناسید در بحران هستید، لطفاً فوراً با خط مشاوره بحران یا خدمات اورژانس تماس بگیرید. شما تنها نیستید.",
      en: "If you or someone you know is in crisis, please call a crisis hotline or emergency services immediately. You are not alone.",
      de: "Wenn Sie oder jemand, den Sie kennen, in einer Krise sind, rufen Sie bitte sofort einen Krisendienst oder den Notdienst an.",
    },
  },
  {
    patterns: [
      "severe bleeding", "خونریزی شدید", "stark bluten", "blutet stark",
      "heavy bleeding", "خونریزی بند نمی‌آید", "uncontrolled bleeding",
    ],
    messages: {
      fa: "خونریزی شدید یا متوقف‌نشونده نیاز به مراقبت فوری پزشکی دارد. لطفاً با اورژانس تماس بگیرید.",
      en: "Severe or uncontrollable bleeding requires immediate medical attention. Please call emergency services.",
      de: "Starke oder unstillbare Blutungen erfordern sofortige ärztliche Hilfe. Bitte rufen Sie den Notdienst.",
    },
  },
  {
    patterns: [
      "unconscious", "بیهوش", "bewusstlos", "passed out", "fainted", "غش کردن",
      "loss of consciousness", "از حال رفتن",
    ],
    messages: {
      fa: "از دست دادن هوشیاری یا بیهوشی یک علامت جدی است. لطفاً فوراً با اورژانس تماس بگیرید.",
      en: "Loss of consciousness is a serious symptom. Please call emergency services immediately.",
      de: "Bewusstlosigkeit ist ein ernstes Symptom. Bitte rufen Sie sofort den Notdienst.",
    },
  },
  {
    patterns: [
      "severe allergic reaction", "واکنش آلرژیک شدید", "anaphylaxis", "آنافیلاکسی",
      "schwere allergische reaktion", "allergischer schock",
      "throat closing", "گلویم بسته شده",
    ],
    messages: {
      fa: "واکنش آلرژیک شدید (با علائمی مانند تنگی نفس، تورم صورت یا گلو) یک وضعیت تهدیدکننده زندگی است. فوراً با اورژانس تماس بگیرید.",
      en: "Severe allergic reaction (difficulty breathing, swelling of face or throat) is life-threatening. Call emergency services immediately.",
      de: "Eine schwere allergische Reaktion (Atemnot, Schwellung von Gesicht oder Hals) ist lebensbedrohlich. Rufen Sie sofort den Notdienst.",
    },
  },
  {
    patterns: [
      "poisoning", "مسمومیت", "vergiftung", "overdose", "اوردوز", "overdosed",
      "چیزی سمی خوردم", "swallowed poison",
    ],
    messages: {
      fa: "مسمومیت یا اوردوز یک وضعیت اورژانسی است. لطفاً فوراً با مرکز کنترل سموم یا اورژانس تماس بگیرید.",
      en: "Poisoning or overdose is a medical emergency. Please call poison control or emergency services immediately.",
      de: "Vergiftung oder Überdosis ist ein medizinischer Notfall. Rufen Sie sofort die Giftnotrufzentrale oder den Notdienst.",
    },
  },
  {
    patterns: [
      "worst headache of my life", "بدترین سردرد زندگی", "thunderclap headache",
      "سردرد ناگهانی شدید",
    ],
    messages: {
      fa: "شدیدترین سردرد زندگی شما که به طور ناگهانی شروع شده، می‌تواند نشانه یک وضعیت جدی باشد. توصیه می‌کنیم فوراً به پزشک مراجعه کنید.",
      en: "The worst headache of your life starting suddenly can indicate a serious condition. Seek immediate medical attention.",
      de: "Der plötzliche schlimmste Kopfschmerz Ihres Lebens kann auf eine ernste Erkrankung hinweisen. Suchen Sie sofort einen Arzt auf.",
    },
  },
];

const HIGH_RISK_PATTERNS: string[][] = [
  ["high fever", "تب بالا", "تب شدید", "hohes fieber", "fever over 39", "تب بالای ۳۹"],
  ["persistent vomiting", "استفراغ مداوم", "استفراغ خونی", "anhaltendes erbrechen"],
  ["blood in stool", "خون در مدفوع", "blut im stuhl", "black stool", "مدفوع سیاه"],
  ["severe abdominal pain", "درد شدید شکم", "starke bauchschmerzen"],
  ["sudden confusion", "گیجی ناگهانی", "verwirrtheit"],
  ["unintentional weight loss", "کاهش وزن ناخواسته", "unbeabsichtigter gewichtsverlust"],
  ["severe dehydration", "کم‌آبی شدید", "starke dehydration"],
  ["pregnant", "باردار هستم", "schwanger"],
  ["infant", "نوزاد", "نوزادم", "baby under 3 months"],
];

const DISCLAIMERS = {
  fa: "⚠️ این اطلاعات جنبه اطلاع‌رسانی دارد و جایگزین تشخیص و درمان پزشکی نیست. برای تشخیص قطعی با پزشک متخصص مشورت کنید.",
  en: "⚠️ This information is for educational purposes only and does not replace professional medical diagnosis or treatment. Consult a healthcare provider.",
  de: "⚠️ Diese Informationen dienen nur zu Bildungszwecken und ersetzen keine ärztliche Diagnose oder Behandlung. Konsultieren Sie einen Arzt.",
};

export function analyzeSafety(input: string, language: "fa" | "en" | "de" = "fa"): SafetyResult {
  const lowerInput = input.toLowerCase();
  const triggeredRules: string[] = [];

  for (const rule of CRITICAL_RULES) {
    for (const pattern of rule.patterns) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        return {
          riskLevel: "critical",
          triggeredRules: [pattern],
          urgentMessage: rule.messages[language],
          shouldBlockNormalFlow: true,
          recommendation: language === "fa"
            ? "لطفاً بلافاصله با شماره اورژانس ۱۱۵ تماس بگیرید یا به نزدیک‌ترین مرکز درمانی مراجعه کنید."
            : language === "de"
              ? "Bitte rufen Sie sofort den Notruf 112 an."
              : "Please call your local emergency number (911/112) immediately.",
        };
      }
    }
  }

  for (const group of HIGH_RISK_PATTERNS) {
    for (const pattern of group) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        triggeredRules.push(pattern);
      }
    }
  }

  if (triggeredRules.length > 0) {
    return {
      riskLevel: "high",
      triggeredRules,
      shouldBlockNormalFlow: false,
      recommendation: language === "fa"
        ? "علائم شما ممکن است نیاز به ارزیابی پزشکی داشته باشند. توصیه می‌کنیم در اسرع وقت با پزشک مشورت کنید."
        : language === "de"
          ? "Ihre Symptome erfordern möglicherweise eine ärztliche Untersuchung. Suchen Sie bald einen Arzt auf."
          : "Your symptoms may require medical evaluation. We recommend consulting a healthcare provider soon.",
    };
  }

  return {
    riskLevel: "low",
    triggeredRules: [],
    shouldBlockNormalFlow: false,
    recommendation: language === "fa"
      ? "این اطلاعات کلی است. در صورت تداوم یا تشدید علائم، با پزشک مشورت کنید."
      : language === "de"
        ? "Allgemeine Informationen. Suchen Sie bei anhaltenden Symptomen einen Arzt auf."
        : "This is general information. If symptoms persist or worsen, consult a healthcare provider.",
  };
}

export function getDisclaimer(language: "fa" | "en" | "de" = "fa"): string {
  return DISCLAIMERS[language];
}
