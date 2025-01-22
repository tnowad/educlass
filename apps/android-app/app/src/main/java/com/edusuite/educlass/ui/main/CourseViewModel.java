package com.edusuite.educlass.ui.main;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;


import com.edusuite.educlass.model.Course;
import com.edusuite.educlass.repository.CourseRepository;

import java.util.List;

public class CourseViewModel extends ViewModel {

    private final CourseRepository courseRepository;
    private final LiveData<List<Course>> courseList;

    public CourseViewModel() {
        courseRepository = new CourseRepository();
        courseList = courseRepository.getCourses();
    }

    public LiveData<List<Course>> getCourseList() {
        return courseList;
    }


    public void joinCourse() {

    }

    public void createCourse() {

    }
}
