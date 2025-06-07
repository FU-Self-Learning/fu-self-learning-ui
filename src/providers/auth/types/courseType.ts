export interface CoursesResponse {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    instructor: InstructorCourse;
    categories: CategoryCourse[];
    createdAt?: string;
    updatedAt?: string;
}

interface InstructorCourse {
    id?: string;
    username: string;
    email?: string;
    avatarUrl?: string;
}

export interface CategoryCourse {
    id: string;
    name: string;
}
