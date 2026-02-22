import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'case-studies');

// Strategic ordering: Flagship work first, then supporting, then concepts
const STRATEGIC_ORDER = [
  'moremi-ai-multimodal-medical-platform',  // 🏆 Flagship: 14mo, CNN, real impact
  'moremi-collaborate',                      // Strong follow-up: shipped feature
  'minohealth-ai-blog',                      // Supporting: content design
  'snackbox-404',                            // Micro-project: shipped
  'kamen-rider-game-hud',                    // Concept: personal work
];

export function getSortedCaseStudiesData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort by strategic priority first, then by date for items not in the order list
  return allPostsData.sort((a, b) => {
    const indexA = STRATEGIC_ORDER.indexOf(a.id);
    const indexB = STRATEGIC_ORDER.indexOf(b.id);
    
    // If both are in strategic order, sort by that
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only a is in strategic order, it comes first
    if (indexA !== -1) return -1;
    
    // If only b is in strategic order, it comes first
    if (indexB !== -1) return 1;
    
    // Fallback to date sort for any unlisted items
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Alias function for the case studies page
export function getCaseStudies() {
  return getSortedCaseStudiesData();
}

export function getAllCaseStudyIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    id: fileName.replace(/\.mdx$/, ''),
  }));
}

export async function getCaseStudyData(id) {
  try {
    const fullPath = path.join(postsDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      content,
      ...data,
    };
  } catch (error) {
    console.error(`Error loading case study ${id}:`, error);
    return null;
  }
}
