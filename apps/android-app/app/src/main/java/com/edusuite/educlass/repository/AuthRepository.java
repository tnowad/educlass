package com.edusuite.educlass.repository;

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

    private final ApolloClient apolloClient;
    private final AuthStorage authStorage;

    @Inject
    public AuthRepository(ApolloClient apolloClient, AuthStorage authStorage) {
        this.apolloClient = apolloClient;
        this.authStorage = authStorage;
    }

    public Single<SignInMutation.Data> signIn(String email, String password) {
        SignInInput signInInput = new SignInInput(email, password);

        return Rx3Apollo.single(apolloClient.mutation(new SignInMutation(signInInput)))
            .map(response -> {
                if (response.data != null) {
                    authStorage.saveTokens(
                        response.data.getSignIn().getAccessToken(),
                        response.data.getSignIn().getRefreshToken()
                    );
                }
                return response.data;
            })
            .onErrorResumeNext(Single::error);
    }

    public Single<SignUpMutation.Data> signUp(String email, String password, String name) {
        SignUpInput signUpInput = new SignUpInput(email, name, password);

        return Rx3Apollo.single(apolloClient.mutation(new SignUpMutation(signUpInput)))
            .map(response -> response.data)
            .onErrorResumeNext(Single::error);
    }

    public Single<VerifyEmailMutation.Data> verifyEmail(String email, String code) {
        VerifyEmailInput verifyEmailInput = new VerifyEmailInput(code, email);

        return Rx3Apollo.single(apolloClient.mutation(new VerifyEmailMutation(verifyEmailInput)))
            .map(response -> response.data)
            .onErrorResumeNext(Single::error);
    }

    public Single<ResendEmailVerificationMutation.Data> resendEmailVerification(String email) {
        var input = new ResendEmailVerificationInput(email);

        return Rx3Apollo.single(apolloClient.mutation(new ResendEmailVerificationMutation(input)))
            .map(response -> response.data)
            .onErrorResumeNext(Single::error);
    }
}
