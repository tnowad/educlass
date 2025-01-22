package com.edusuite.educlass.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.edusuite.educlass.model.Course;
import java.util.ArrayList;
import java.util.List;
public class CourseRepository {


    public LiveData<List<Course>> getCourses() {
        MutableLiveData<List<Course>> coursesLiveData = new MutableLiveData<>();
        List<Course> mockCourses = new ArrayList<>();
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));
        mockCourses.add(new Course(1, "Giai tich 1", "giai tich 1"));

        coursesLiveData.setValue(mockCourses);

        return coursesLiveData;
    }
}
