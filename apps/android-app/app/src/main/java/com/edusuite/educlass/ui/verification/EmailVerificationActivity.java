package com.edusuite.educlass.ui.verification;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.databinding.ActivityEmailVerificationBinding;

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
            viewModel.email.setValue(email); // Set email in ViewModel
        }
    }
}
