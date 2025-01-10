package com.edusuite.educlass.ui.signin;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.R;
import com.edusuite.educlass.databinding.ActivitySignInBinding;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class SignInActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SignInViewModel signInViewModel = new ViewModelProvider(this).get(SignInViewModel.class);
        ActivitySignInBinding binding = DataBindingUtil.setContentView(this, R.layout.activity_sign_in);
        binding.setViewModel(signInViewModel);
        binding.setLifecycleOwner(this);

        EdgeToEdge.enable(this);
    }
}
