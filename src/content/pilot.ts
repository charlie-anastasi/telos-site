// Pilot program content shared by the Overview, For Students and For Employers
// pages: the tracks, the headline stats and each timeline. Edit copy here and
// the pages pick it up; where each piece sits on the page is set in the page.

export const tracks = [
  { name: "Sales & Revenue", image: "/images/young-sales-rep.png" },
  { name: "Finance & Business Ops", image: "/images/imgg-k5l-vwgb0x8h.png" },
  { name: "Healthcare Operations", image: "/images/imgg-nsr-x9qmgxe9.png" },
];

export const stats = {
  students: { value: "63%", label: "of students who wanted an internship couldn’t get one" },
  employers: {
    value: "48%",
    label: "of employers name operational issues as their primary barrier to expanding internships.",
  },
};

export type TimelineStep = { date: string; title: string; body: string };

/** Overview page: the program at a glance. */
export const overviewTimeline: TimelineStep[] = [
  { date: "SPRING 2028", title: "Train", body: "Students complete pre-internship training on the role and the company." },
  { date: "SUMMER 2028", title: "Work", body: "Deliver real value over ten weeks and get paid." },
  {
    date: "FALL 2028",
    title: "Earn credit",
    body: "Earn six credits from an accredited university that you can submit for credit at your college.",
  },
];

/** For Students page. */
export const studentTimeline: TimelineStep[] = [
  {
    date: "SPRING 2027",
    title: "Early access",
    body: "A cohort of fifteen students will be selected for the program in March 2027. These students will get priority access for internships",
  },
  {
    date: "FALL 2027",
    title: "Apply and interview",
    body: "Internship listings are posted in early fall for the remaining slots, and decisions will be made before Thanksgiving.",
  },
  {
    date: "SPRING 2028",
    title: "Train",
    body: "Three hours per week of asynchronous training that prepares you to make an impact your first week on the job. Ends with a kickoff with your supervisor.",
  },
  {
    date: "SUMMER 2028",
    title: "Work & earn credit",
    body: "Upon successful completion of the internship, you’ll finish with a portfolio of work and six credits to transfer back to your college.",
  },
];

/** For Employers page. */
export const employerTimeline: TimelineStep[] = [
  {
    date: "SUMMER 2027",
    title: "Needs assessment",
    body: "Telos conducts a needs assessment to define roles. Pilot employers commit to posting positions by Summer 2027, but retain authority on hiring decisions.",
  },
  {
    date: "FALL 2027",
    title: "Interview and hire",
    body: "Telos posts the listing, screens applicants, and sends you finalists. Interviews and final decisions are made by Thanksgiving.",
  },
  {
    date: "SPRING 2028",
    title: "Approve training program",
    body: "Share your knowledge base, sign off on the pre-internship training, join a supervisor kickoff, and welcome a trained intern in June.",
  },
];
