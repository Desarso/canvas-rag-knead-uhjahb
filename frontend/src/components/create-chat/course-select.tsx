import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface Course {
  course_id: string;
  course_name: string;
  course_code: string;
}

interface Props {
  userId: string;
  course: string;
  setSelectedCourse: (courseId: string) => void;
}

export function CourseSelect({ userId, course, setSelectedCourse }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    console.log("right here");
    async function fetchCourses(userId: string) {
      if (userId === "") return;
      try {
        const url = new URL("http://127.0.0.1:8000/get_courses");
        url.searchParams.append("user_id", userId);
        console.log(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching chats: ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
        console.log("courses:", data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCourses(userId);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Course Select</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={course} onValueChange={setSelectedCourse}>
          {courses.map((course) => (
            <DropdownMenuRadioItem
              key={course.course_id}
              value={course.course_id}
            >
              {course.course_code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
