package com.edusuite.educlass.ui.signin;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class SignInViewModel extends ViewModel {

    private static final String TAG = "SignInViewModel";
    public MutableLiveData<String> password = new MutableLiveData<>("");
    public MutableLiveData<String> email = new MutableLiveData<>("");

    public void doSignIn() {
        Log.d(TAG, "doSignIn: " + email.getValue() + " " + password.getValue());
    }
}
