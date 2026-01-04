import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'case-studies');

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

  return allPostsData.sort((a, b) => {
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
    params: {
      id: fileName.replace(/\.mdx$/, ''),
    },
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