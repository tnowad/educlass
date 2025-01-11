package com.edusuite.educlass.ui.signup;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class SignUpViewModel extends ViewModel {
    private static final String TAG = "SignInViewModel";
    public MutableLiveData<String> password = new MutableLiveData<>("");
    public MutableLiveData<String> email = new MutableLiveData<>("");
    public MutableLiveData<String> confirmPassword = new MutableLiveData<>("");
    public final MutableLiveData<Boolean> _navigateToSignIn  = new MutableLiveData<>();
    public LiveData<Boolean> navigateToSignIn = _navigateToSignIn;
    public void doSignUp() {
        Log.d(TAG, "doSignIn: " + email.getValue() + " " + password.getValue());
    }
    public void onSignInClick() {
        _navigateToSignIn.setValue(true);
    }
    public void resetNavigation() {
        _navigateToSignIn.setValue(false);
    }
}
