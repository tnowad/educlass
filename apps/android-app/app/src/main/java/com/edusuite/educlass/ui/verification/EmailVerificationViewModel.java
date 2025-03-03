package com.edusuite.educlass.ui.verification;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.edusuite.educlass.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.disposables.CompositeDisposable;

@HiltViewModel
public class EmailVerificationViewModel extends ViewModel {
    private static final String TAG = "EmailVerificationViewModel";

    public final MutableLiveData<String> email = new MutableLiveData<>("user@educlass.com");
    public final MutableLiveData<String> verificationCode = new MutableLiveData<>();
    public final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    public final MutableLiveData<Boolean> verificationSuccess = new MutableLiveData<>(false);
    public final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    private final AuthRepository authRepository;
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public EmailVerificationViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void verifyEmail() {
        String code = verificationCode.getValue();

        if (code == null || code.isEmpty()) {
            errorMessage.setValue("Verification code is required");
            return;
        }

        loading.setValue(true);

//        disposables.add(authRepository.verifyEmail(code)
//            .subscribeOn(Schedulers.io())
//            .observeOn(AndroidSchedulers.mainThread())
//            .doFinally(() -> loading.setValue(false))
//            .subscribe(response -> {
//                if (response.getVerifyEmail().getSuccess()) {
//                    verificationSuccess.setValue(true);
//                } else {
//                    errorMessage.setValue(response.getVerifyEmail().getMessage());
//                }
//            }, throwable -> {
//                Log.e(TAG, "Verification error: " + throwable.getMessage(), throwable);
//                errorMessage.setValue(throwable.getMessage());
//            }));
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
    }
}
