const TECH_KEYWORDS = [
  // Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "golang", "rust",
  // Frontend
  "react", "vue", "angular", "nextjs", "html", "css", "tailwind", "redux",
  // Backend
  "nodejs", "express", "fastapi", "django", "spring", "rest", "graphql", "api",
  // Database
  "postgresql", "mysql", "mongodb", "redis", "supabase", "firebase",
  // Cloud & DevOps
  "aws", "docker", "kubernetes", "github", "git", "ci/cd", "linux",
  // AI/ML
  "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
  "pandas", "numpy", "scikit-learn", "data science",
  // Soft skills
  "agile", "scrum", "communication", "leadership", "problem solving",
  // Indian tech keywords
  "tcs", "infosys", "wipro", "cognizant", "accenture",
];

export function calculateATSScore(resumeText: string): {
  score: number;
  foundKeywords: string[];
  missingKeywords: string[];
  feedback: string[];
} {
  const text = resumeText.toLowerCase();
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of TECH_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const score = Math.round((foundKeywords.length / TECH_KEYWORDS.length) * 100);

  const feedback: string[] = [];
  if (score < 30) feedback.push("Add more technical skills to your resume");
  if (score < 50) feedback.push("Include cloud technologies like AWS or Docker");
  if (!text.includes("github")) feedback.push("Add your GitHub profile link");
  if (!text.includes("project")) feedback.push("Add more project descriptions");
  if (text.length < 500) feedback.push("Resume seems too short, add more details");

  return { score, foundKeywords, missingKeywords, feedback };
}