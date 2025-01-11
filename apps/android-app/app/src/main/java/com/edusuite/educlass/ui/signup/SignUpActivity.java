package com.edusuite.educlass.ui.signup;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.R;
import com.edusuite.educlass.ui.signin.SignInActivity;

public class SignUpActivity extends AppCompatActivity {


    private SignUpViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        viewModel = new ViewModelProvider(this).get(SignUpViewModel.class);
        TextView signUpPromptText = findViewById(R.id.signInPromptText);
        signUpPromptText.setOnClickListener(view -> viewModel.onSignInClick());
        viewModel.navigateToSignIn.observe(this, navigate -> {
            if(navigate != null && navigate){
                Intent intent = new Intent(SignUpActivity.this, SignInActivity.class);
                startActivity(intent);
                finish();
                viewModel.resetNavigation();
            }
        });
    }
}
