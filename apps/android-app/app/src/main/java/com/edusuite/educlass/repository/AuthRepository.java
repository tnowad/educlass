package com.edusuite.educlass.repository;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.SignInMutation;
import com.edusuite.educlass.storage.AuthStorage;
import com.edusuite.educlass.type.SignInInput;

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
}
