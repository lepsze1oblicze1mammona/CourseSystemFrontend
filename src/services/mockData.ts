import { Course } from '../types/courseTypes';

export const mockCourses: Course[] = [
  {
    id: 2,
    name: "Matematyka podstawowa",
    assignments: [
      {
        id: 1,
        title: "Podstawy algebry",
        description: "Rozwiąż zadania 1-10 ze strony 45",
        deadline: "2025-06-15"
      },
      {
        id: 2,
        title: "Geometria płaska",
        description: "Zadania z trójkątów i okręgów",
        deadline: "2025-06-22"
      }
    ]
  },
  {
    id: 1,
    name: "Fizyka kwantowa",
    assignments: []
  }
];

// Symulacja pobierania danych z API
export const fetchCourse = async (courseId: string): Promise<Course | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const course = mockCourses.find(c => c.id === Number(courseId));
      resolve(course || null);
    }, 500);
  });
};
