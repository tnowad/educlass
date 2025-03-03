package com.edusuite.educlass.ui.signup;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.databinding.ActivitySignUpBinding;
import com.edusuite.educlass.ui.verification.EmailVerificationActivity;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class SignUpActivity extends AppCompatActivity {
    private ActivitySignUpBinding binding;
    private SignUpViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignUpBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(SignUpViewModel.class);
        binding.setViewModel(viewModel);
        binding.setLifecycleOwner(this);

        viewModel.signUpSuccess.observe(this, email -> {
            if (email != null) {
                Toast.makeText(this, "Sign-up successful. Please verify your email.", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(this, EmailVerificationActivity.class);
                intent.putExtra("email", email);
                startActivity(intent);
                finish();
            }
        });

        viewModel.errorMessage.observe(this, message -> {
            if (message != null && !message.isEmpty()) {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
