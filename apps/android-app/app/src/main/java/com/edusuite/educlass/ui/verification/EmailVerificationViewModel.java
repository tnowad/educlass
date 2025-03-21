package com.edusuite.educlass.ui.verification;

import android.os.CountDownTimer;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.edusuite.educlass.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class EmailVerificationViewModel extends ViewModel {
    private static final String TAG = "EmailVerificationViewModel";

    public final MutableLiveData<String> email = new MutableLiveData<>("user@educlass.com");
    public final MutableLiveData<String> verificationCode = new MutableLiveData<>();
    public final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    public final MutableLiveData<Boolean> verificationSuccess = new MutableLiveData<>(false);
    public final MutableLiveData<Boolean> resendSuccess = new MutableLiveData<>(false);
    public final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    public final MutableLiveData<Integer> countdownTimer = new MutableLiveData<>(0);

    private final AuthRepository authRepository;
    private final CompositeDisposable disposables = new CompositeDisposable();
    private CountDownTimer countDownTimer;

    @Inject
    public EmailVerificationViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void verifyEmail() {
        String emailValue = email.getValue();
        String codeValue = verificationCode.getValue();

        if (codeValue == null || codeValue.isEmpty()) {
            errorMessage.setValue("Verification code is required");
            return;
        }

        loading.setValue(true);

        disposables.add(authRepository.verifyEmail(emailValue, codeValue)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doFinally(() -> loading.setValue(false))
            .subscribe(response -> {
                if (response.getVerifyEmail().getSuccess()) {
                    verificationSuccess.setValue(true);
                } else {
                    errorMessage.setValue(response.getVerifyEmail().getMessage());
                }
            }, throwable -> {
                Log.e(TAG, "Verification error: " + throwable.getMessage(), throwable);
                errorMessage.setValue(throwable.getMessage());
            }));
    }

    public void resendEmailVerification() {
        if (countdownTimer.getValue() != null && countdownTimer.getValue() > 0) {
            return; // Prevent resending during countdown
        }

        String emailValue = email.getValue();
        if (emailValue == null || emailValue.isEmpty()) {
            errorMessage.setValue("Email is required");
            return;
        }

        loading.setValue(true);

        disposables.add(authRepository.resendEmailVerification(emailValue)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .doFinally(() -> loading.setValue(false))
            .subscribe(response -> {
                if (response.getResendEmailVerification().getSuccess()) {
                    resendSuccess.setValue(true);
                    startCountdown();
                } else {
                    errorMessage.setValue(response.getResendEmailVerification().getMessage());
                }
            }, throwable -> {
                Log.e(TAG, "Resend error: " + throwable.getMessage(), throwable);
                errorMessage.setValue("Failed to resend email");
            }));
    }

    private void startCountdown() {
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }

        countDownTimer = new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                countdownTimer.setValue((int) (millisUntilFinished / 1000));
            }

            public void onFinish() {
                countdownTimer.setValue(0);
            }
        }.start();
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
    }
}
