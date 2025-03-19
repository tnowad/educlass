package com.edusuite.educlass.ui.signin;

import android.util.Log;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import dagger.hilt.android.lifecycle.HiltViewModel;

import com.apollographql.apollo3.exception.ApolloNetworkException;
import com.edusuite.educlass.repository.AuthRepository;
import com.edusuite.educlass.SignInMutation;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import javax.inject.Inject;

@HiltViewModel
public class SignInViewModel extends ViewModel {
    private static final String TAG = "SignInViewModel";

    public final MutableLiveData<String> email = new MutableLiveData<>("");
    public final MutableLiveData<String> password = new MutableLiveData<>("");
    public final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    public final MutableLiveData<SignInMutation.Data> signInData = new MutableLiveData<>();
    public final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    private final AuthRepository authRepository;
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public SignInViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void doSignIn() {
        String emailValue = email.getValue();
        String passwordValue = password.getValue();

        if (emailValue == null || emailValue.isEmpty() || passwordValue == null || passwordValue.isEmpty()) {
            errorMessage.setValue("Email and Password required");
            Log.w(TAG, "Sign-in attempt failed: missing email or password");
            return;
        }

        Log.d(TAG, "Attempting sign-in with email: " + emailValue);
        loading.setValue(true);

        disposables.add(authRepository.signIn(emailValue, passwordValue)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(data -> {
                Log.d(TAG, "Sign-in successful: " + data);
                signInData.setValue(data);
                loading.setValue(false);
            }, throwable -> {
                if (throwable instanceof ApolloNetworkException) {
                    Log.e(TAG, "Network error: Unable to reach GraphQL server", throwable);
                } else {
                    Log.e(TAG, "GraphQL error: " + throwable.getMessage(), throwable);
                }
                errorMessage.setValue(throwable.getMessage());
                loading.setValue(false);
            }));
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
        Log.d(TAG, "ViewModel cleared and disposables cleared");
    }
}
