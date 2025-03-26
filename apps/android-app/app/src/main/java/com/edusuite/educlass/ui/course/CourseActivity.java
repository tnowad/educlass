package com.edusuite.educlass.ui.course;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.databinding.ActivityCourseBinding;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class CourseActivity extends AppCompatActivity {
    private ActivityCourseBinding binding;
    private CourseViewModel viewModel;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCourseBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        viewModel = new ViewModelProvider(this).get(CourseViewModel.class);
        binding.setViewModel(viewModel);
        binding.setLifecycleOwner(this);

        String courseId = getIntent().getStringExtra("COURSE_ID");
        if (courseId != null) {
            viewModel.fetchCourse(courseId);
        }
    }
}
