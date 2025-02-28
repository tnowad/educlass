package com.edusuite.educlass.ui.signin;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.apollographql.apollo3.exception.ApolloNetworkException;
import com.edusuite.educlass.SignInMutation;
import com.edusuite.educlass.repository.AuthRepository;
import com.edusuite.educlass.storage.AuthStorage;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class SignInViewModel extends ViewModel {
    private static final String TAG = "SignInViewModel";

    public final MutableLiveData<String> email = new MutableLiveData<>();
    public final MutableLiveData<String> password = new MutableLiveData<>();
    public final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    public final MutableLiveData<SignInMutation.Data> signInData = new MutableLiveData<>();
    public final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<Boolean> navigateToSignUp = new MutableLiveData<>();

    private final AuthRepository authRepository;
    private final AuthStorage authStorage;
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public SignInViewModel(AuthRepository authRepository, AuthStorage authStorage) {
        this.authRepository = authRepository;
        this.authStorage = authStorage;
    }

    public void signIn() {
        String emailValue = email.getValue();
        String passwordValue = password.getValue();

        if (emailValue == null || emailValue.isEmpty() || passwordValue == null || passwordValue.isEmpty()) {
            errorMessage.setValue("Email and Password are required");
            Log.w(TAG, "Sign-in failed: missing credentials");
            return;
        }

        Log.d(TAG, "Attempting sign-in with email: " + emailValue);
        loading.setValue(true);

        disposables.add(authRepository.signIn(emailValue, passwordValue)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doFinally(() -> loading.setValue(false))
            .subscribe(data -> {
                Log.d(TAG, "Sign-in successful: " + data);
                authStorage.saveTokens(
                    data.getSignIn().getAccessToken(),
                    data.getSignIn().getRefreshToken());
                signInData.setValue(data);
            }, throwable -> {
                Log.e(TAG, throwable instanceof ApolloNetworkException
                    ? "Network error: Unable to reach GraphQL server"
                    : "GraphQL error: " + throwable.getMessage(), throwable);
                errorMessage.setValue(throwable.getMessage());
            }));
    }

    public void navigateToSignUp() {
        navigateToSignUp.setValue(true);
    }

    public LiveData<Boolean> getNavigateToSignUp() {
        return navigateToSignUp;
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
        Log.d(TAG, "ViewModel cleared and disposables disposed");
    }
}
