package com.edusuite.educlass.repository;

import android.util.Log;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.ResendEmailVerificationMutation;
import com.edusuite.educlass.SignInMutation;
import com.edusuite.educlass.SignUpMutation;
import com.edusuite.educlass.VerifyEmailMutation;
import com.edusuite.educlass.storage.AuthStorage;
import com.edusuite.educlass.type.ResendEmailVerificationInput;
import com.edusuite.educlass.type.SignInInput;
import com.edusuite.educlass.type.SignUpInput;
import com.edusuite.educlass.type.VerifyEmailInput;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;

@Singleton
public class AuthRepository {
    private static final String TAG = "AuthRepository";

    private final ApolloClient apolloClient;
    private final AuthStorage authStorage;

    @Inject
    public AuthRepository(ApolloClient apolloClient, AuthStorage authStorage) {
        this.apolloClient = apolloClient;
        this.authStorage = authStorage;
    }

    public Single<SignInMutation.Data> signIn(String email, String password) {
        Log.d(TAG, "Signing in with email: " + email);
        SignInInput signInInput = new SignInInput(email, password);

        return Rx3Apollo.single(apolloClient.mutation(new SignInMutation(signInInput)))
            .doOnSuccess(response -> {
                if (response.data != null) {
                    Log.d(TAG, "Sign-in successful for email: " + email);
                    authStorage.saveTokens(
                        response.data.getSignIn().getAccessToken(),
                        response.data.getSignIn().getRefreshToken()
                    );
                } else {
                    Log.w(TAG, "Sign-in response data is null for email: " + email);
                }
            })
            .doOnError(error -> Log.e(TAG, "Sign-in failed for email: " + email, error))
            .map(response -> response.data);
    }

    public Single<SignUpMutation.Data> signUp(String email, String password, String name) {
        Log.d(TAG, "Signing up with email: " + email);
        SignUpInput signUpInput = new SignUpInput(email, name, password);

        return Rx3Apollo.single(apolloClient.mutation(new SignUpMutation(signUpInput)))
            .doOnSuccess(response -> Log.d(TAG, "Sign-up successful for email: " + email))
            .doOnError(error -> Log.e(TAG, "Sign-up failed for email: " + email, error))
            .map(response -> response.data);
    }

    public Single<VerifyEmailMutation.Data> verifyEmail(String email, String code) {
        Log.d(TAG, "Verifying email: " + email);
        VerifyEmailInput verifyEmailInput = new VerifyEmailInput(code, email);

        return Rx3Apollo.single(apolloClient.mutation(new VerifyEmailMutation(verifyEmailInput)))
            .doOnSuccess(response -> Log.d(TAG, "Email verification successful for email: " + email))
            .doOnError(error -> Log.e(TAG, "Email verification failed for email: " + email, error))
            .map(response -> response.data);
    }

    public Single<ResendEmailVerificationMutation.Data> resendEmailVerification(String email) {
        Log.d(TAG, "Resending email verification for email: " + email);
        var input = new ResendEmailVerificationInput(email);

        return Rx3Apollo.single(apolloClient.mutation(new ResendEmailVerificationMutation(input)))
            .doOnSuccess(response -> Log.d(TAG, "Resend email verification successful for email: " + email))
            .doOnError(error -> Log.e(TAG, "Resend email verification failed for email: " + email, error))
            .map(response -> response.data);
    }
}
