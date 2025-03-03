package com.edusuite.educlass.ui.verification;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.databinding.ActivityEmailVerificationBinding;
import com.edusuite.educlass.ui.signin.SignInActivity;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class EmailVerificationActivity extends AppCompatActivity {

    private ActivityEmailVerificationBinding binding;
    private EmailVerificationViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEmailVerificationBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(EmailVerificationViewModel.class);
        binding.setViewModel(viewModel);
        binding.setLifecycleOwner(this);

        String email = getIntent().getStringExtra("email");
        if (email != null) {
            viewModel.email.setValue(email);
        }

        viewModel.verificationSuccess.observe(this, success -> {
            if (success) {
                Toast.makeText(this, "Verify Successful", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(this, SignInActivity.class));
                finish();
            }
        });
        viewModel.resendSuccess.observe(this, success -> {
            if (success) {
                Toast.makeText(this, "Verification email resent.", Toast.LENGTH_SHORT).show();
            }
        });
        viewModel.errorMessage.observe(this, message -> {
            if (message != null && !message.isEmpty()) {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
