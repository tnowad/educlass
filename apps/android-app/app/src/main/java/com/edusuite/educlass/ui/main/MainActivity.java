package com.edusuite.educlass.ui.main;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.edusuite.educlass.storage.AuthStorage;
import com.edusuite.educlass.ui.home.HomeActivity;
import com.edusuite.educlass.ui.signin.SignInActivity;

import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class MainActivity extends AppCompatActivity {
    @Inject
    AuthStorage authStorage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (authStorage.getAccessToken() != null) {
            startActivity(new Intent(this, HomeActivity.class));
        } else {
            startActivity(new Intent(this, SignInActivity.class));
        }
        finish();
    }
}
