package com.edusuite.educlass.ui.main;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.ui.home.HomeActivity;
import com.edusuite.educlass.ui.signin.SignInActivity;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class MainActivity extends AppCompatActivity {
    private MainViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel = new ViewModelProvider(this).get(MainViewModel.class);

        navigateToNextScreen();
    }

    private void navigateToNextScreen() {
        Class<?> nextActivity = viewModel.isUserLoggedIn() ? HomeActivity.class : SignInActivity.class;
        startActivity(new Intent(this, nextActivity));
        finish();
    }
}
