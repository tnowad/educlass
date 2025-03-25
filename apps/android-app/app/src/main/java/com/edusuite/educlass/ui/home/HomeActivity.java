package com.edusuite.educlass.ui.home;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.edusuite.educlass.R;
import com.edusuite.educlass.databinding.ActivityHomeBinding;
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
        setupToolbar();
        setupDrawer();
        setupRecyclerView();
        setupObservers();

        binding.addCourseButton.setOnClickListener(view -> {
            Toast.makeText(this, "Create new class", Toast.LENGTH_SHORT).show();
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (binding.drawerLayout.isDrawerOpen(GravityCompat.START)) {
                    binding.drawerLayout.closeDrawer(GravityCompat.START);
                } else {
                    finish();
                }
            }
        });

    }


    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        getSupportActionBar().setTitle("Edu Class");
        binding.toolbar.setNavigationOnClickListener(view -> binding.drawerLayout.openDrawer(GravityCompat.START));
    }

    private void setupDrawer() {
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
            this, binding.drawerLayout, binding.toolbar,
            R.string.navigation_drawer_open, R.string.navigation_drawer_close
        );
        binding.drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        binding.navigationView.setNavigationItemSelectedListener(this);
    }

    private void setupRecyclerView() {
        courseAdapter = new CourseAdapter(course -> {
        });
        binding.recyclerViewMain.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerViewMain.setAdapter(courseAdapter);
    }

    private void setupObservers() {
        viewModel.getCourses().observe(this, courses -> {
            if (courses != null) {
                courseAdapter.submitList(courses);
            }
        });
        viewModel.getErrorMessage().observe(this, message -> {
            if (message != null && !message.isEmpty()) {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        return true;
    }
}
