/** Весь текст сайта — на кыргызском. */
export const content = {
  groomName: "Нурбек",
  brideName: "Керемет",

  /** Формальное приглашение — событие 2-в-1: кыз узатуу + үйлөнүү тою */
  invitationGreeting: "Урматтуу биздин коноктор!",
  invitationBody:
    "Сиздерди балдарыбыз Нурбек менен Кереметтин кыз узатуу жана " +
    "үйлөнүү тоюна келип, батаңызды берип, кадырлуу коногубуз " +
    "болуп кетүүгө чакырабыз!",

  /** Той ээлери — семьи, принимающие гостей (не молодожёны) */
  hosts: [
    { name1: "Бакытбек", name2: "Бегайым" },
    { name1: "Жумагул", name2: "Айгуль" },
  ],

  /** ISO-строка с датой и временем тоя (используется для countdown/calendar) */
  eventDateISO: "2026-10-09T14:00:00+06:00",
  eventDateDisplay: "9-октябрь, 2026",
  eventTimeDisplay: "16:00",
  eventMonthLabel: "Октябрь",
  eventYear: 2026,
  eventDay: 9,
  rsvpDeadlineDisplay: "5-октябрга",

  venueName: "Аска-Нур",
  venueAddress: "Нарын шаары",
  mapUrl: "https://2gis.kg/bishkek/geo/70000001078946817/76.021591,41.424102",

  /**
   * Ответы принимают отдельно со стороны жениха и со стороны невесты,
   * чтобы родня не написала не туда. Формат для wa.me — без "+".
   */
  rsvpContacts: [
    { side: "Бала тарап", phone: "996554943024" },
    { side: "Кыз тарап", phone: "996550241203" },
  ],
} as const;

/** Подписи интерфейса — только кыргызский */
export const ui = {
  introButton: "Тойго чакырууну ачуу",
  rsvpJump: "Жооп берүү",
  timeLabel: "Тойдун башталышы",
  heroTagline: "Тоюбуздун кубанычын биз менен бөлүшүүгө чакырабыз",
  countdownLabel: "Тойго чейин",
  countdownUnits: { days: "күн", hours: "саат", minutes: "мүнөт", seconds: "секунд" },
  calendarLabel: "Той-күн",
  detailsLabel: "Той салтанаты",
  mapLink: "Картаны ачуу",
  hostsLabel: "Той ээлери",
  rsvpTitle: "Кубанычыбызга ортоктош болуңуздар!",
  rsvpNameLabel: "Атыңыз",
  rsvpNamePlaceholder: "Атыңызды жазыңыз",
  rsvpSend: "Жоопту жөнөтүү",
  /** Короткий вариант для узких кнопок «стенка на стенку» */
  rsvpSendShort: "Жөнөтүү",
  musicOn: "Обонду күйгүзүү",
  musicOff: "Обонду өчүрүү",
} as const;

export function rsvpHint() {
  return `Тойго катышууңузду ${content.rsvpDeadlineDisplay} чейин ырастап коюңуз`;
}
