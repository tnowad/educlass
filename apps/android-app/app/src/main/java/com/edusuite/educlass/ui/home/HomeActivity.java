package com.edusuite.educlass.ui.home;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.edusuite.educlass.databinding.ActivityHomeBinding;
import com.edusuite.educlass.ui.course.CourseActivity;
import com.google.android.material.navigation.NavigationView;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class HomeActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ActivityHomeBinding binding;
    private HomeViewModel viewModel;
    private CourseAdapter courseAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        binding.setViewModel(viewModel);
        binding.setLifecycleOwner(this);

        setupToolbar();
        setupRecyclerView();

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (binding.homeDrawerLayout.isDrawerOpen(GravityCompat.START)) {
                    binding.homeDrawerLayout.closeDrawer(GravityCompat.START);
                } else {
                    finish();
                }
            }
        });

    }

    private void setupToolbar() {
        setSupportActionBar(binding.homeToolbar);
        getSupportActionBar().setTitle("Edu Class");
        binding.homeToolbar.setNavigationOnClickListener(view -> binding.homeDrawerLayout.openDrawer(GravityCompat.START));
    }

    private void setupRecyclerView() {
        courseAdapter = new CourseAdapter(course -> {
            var intent = new Intent(this, CourseActivity.class);
            intent.putExtra("COURSE_ID", course.getId());
            startActivity(intent);
        });
        binding.homeCourseRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.homeCourseRecyclerView.setAdapter(courseAdapter);

        viewModel.getCourses().observe(this, courses -> {
            if (courses != null) {
                courseAdapter.submitList(courses);
            }
        });
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        return false;
    }
}
