package com.edusuite.educlass.ui.signup;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.apollographql.apollo3.exception.ApolloNetworkException;
import com.edusuite.educlass.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class SignUpViewModel extends ViewModel {
    private static final String TAG = "SignUpViewModel";

    public final MutableLiveData<String> email = new MutableLiveData<>("user@educlass.com");
    public final MutableLiveData<String> password = new MutableLiveData<>("Password@123");
    public final MutableLiveData<String> confirmPassword = new MutableLiveData<>("Password@123");
    public final MutableLiveData<String> name = new MutableLiveData<>("John Doe");
    public final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    public final MutableLiveData<Boolean> signUpSuccess = new MutableLiveData<>(false);
    public final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    private final AuthRepository authRepository;
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public SignUpViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void signUp() {
        String emailValue = email.getValue();
        String passwordValue = password.getValue();
        String confirmPasswordValue = confirmPassword.getValue();
        String nameValue = name.getValue();

        if (emailValue == null || emailValue.isEmpty() ||
            passwordValue == null || passwordValue.isEmpty() ||
            nameValue == null || nameValue.isEmpty()) {
            errorMessage.setValue("All fields are required");
            Log.w(TAG, "Sign-up failed: missing fields");
            return;
        }

        if (!confirmPasswordValue.equals(passwordValue)) {
            errorMessage.setValue("Confirm password not match!");
            return;
        }

        Log.d(TAG, "Attempting sign-up with email: " + emailValue);
        loading.setValue(true);

        disposables.add(authRepository.signUp(emailValue, passwordValue, nameValue)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doFinally(() -> loading.setValue(false))
            .subscribe(response -> {
                if (response.getSignUp().getSuccess()) {
                    Log.d(TAG, "Sign-up successful: " + response.getSignUp().getMessage());
                    signUpSuccess.setValue(true);
                } else {
                    errorMessage.setValue(response.getSignUp().getMessage());
                }
            }, throwable -> {
                Log.e(TAG, throwable instanceof ApolloNetworkException
                    ? "Network error: Unable to reach GraphQL server"
                    : "GraphQL error: " + throwable.getMessage(), throwable);
                errorMessage.setValue(throwable.getMessage());
            }));
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
        Log.d(TAG, "ViewModel cleared and disposables disposed");
    }
}
